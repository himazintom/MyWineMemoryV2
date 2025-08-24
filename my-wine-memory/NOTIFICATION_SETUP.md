# 通知機能の正しい実装ガイド

## 現在の実装の問題点

現在の実装は**ブラウザ内でのみ動作する疑似的な通知**であり、真のプッシュ通知ではありません。

### 問題：
1. **ブラウザを閉じると通知が送信されない**
2. **バックグラウンドで通知が送信できない**
3. **サーバー側の実装が存在しない**

## 真の通知実装に必要なステップ

### 1. Firebase Cloud Messaging (FCM) の設定

#### a. Firebase Consoleでの設定
1. Firebase Console → プロジェクト設定 → Cloud Messaging
2. Web Push証明書の「鍵ペア」を生成
3. VAPID keyをコピー

#### b. 環境変数の設定
```bash
# .env.local
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 2. サーバー側の実装（Firebase Cloud Functions）

#### a. Cloud Functionsのセットアップ
```bash
npm install -g firebase-tools
firebase init functions
cd functions
npm install firebase-admin
```

#### b. 通知送信関数の実装
```typescript
// functions/src/notifications.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// 定期的な通知送信（Cloud Scheduler使用）
export const sendScheduledNotifications = functions.pubsub
  .schedule('0 9,15,19 * * *') // 9時、15時、19時に実行
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    const db = admin.firestore();
    const messaging = admin.messaging();
    
    // 通知設定が有効なユーザーを取得
    const usersSnapshot = await db
      .collection('notification_settings')
      .where('enabled', '==', true)
      .get();
    
    const notifications = [];
    
    for (const doc of usersSnapshot.docs) {
      const userId = doc.id;
      const settings = doc.data();
      
      // FCMトークンを取得
      const tokensSnapshot = await db
        .collection('fcm_tokens')
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .get();
      
      for (const tokenDoc of tokensSnapshot.docs) {
        const token = tokenDoc.data().token;
        
        // 通知タイプに応じてメッセージを作成
        const message = await createNotificationMessage(userId, settings, token);
        if (message) {
          notifications.push(messaging.send(message));
        }
      }
    }
    
    await Promise.all(notifications);
    console.log(`Sent ${notifications.length} notifications`);
  });

// ワイン記録からの振り返り通知
export const sendWineMemoryRecall = functions.pubsub
  .schedule('0 */3 * * *') // 3時間ごと
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    const db = admin.firestore();
    const messaging = admin.messaging();
    
    // アクティブユーザーを取得
    const usersSnapshot = await db
      .collection('notification_settings')
      .where('enabled', '==', true)
      .where('types.streak_reminder', '==', true)
      .get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // ランダムに過去のワイン記録を取得
      const recordsSnapshot = await db
        .collection('tasting_records')
        .where('userId', '==', userId)
        .orderBy('tastingDate', 'desc')
        .limit(50)
        .get();
      
      if (recordsSnapshot.empty) continue;
      
      const records = recordsSnapshot.docs;
      const randomRecord = records[Math.floor(Math.random() * records.length)].data();
      
      // ワイン情報を取得
      const wineDoc = await db.collection('wines_master').doc(randomRecord.wineId).get();
      if (!wineDoc.exists) continue;
      
      const wine = wineDoc.data();
      
      // FCMトークンを取得して通知送信
      const tokensSnapshot = await db
        .collection('fcm_tokens')
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .get();
      
      for (const tokenDoc of tokensSnapshot.docs) {
        const message = {
          token: tokenDoc.data().token,
          notification: {
            title: `${wine.wineName}を覚えていますか？`,
            body: `評価${randomRecord.overallRating}/10のワインでした。また飲みたいですか？`
          },
          webpush: {
            fcmOptions: {
              link: `https://my-wine-memory.himazi.com/wine-detail/${randomRecord.wineId}`
            }
          }
        };
        
        await messaging.send(message);
      }
    }
  });

// クイズリマインダー
export const sendQuizReminders = functions.pubsub
  .schedule('0 10,14,18 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    // クイズ通知のロジック
  });
```

### 3. Firebase Cloud Schedulerの設定

Firebase ConsoleまたはCLIでCloud Schedulerジョブを設定：

```bash
# Cloud Functionsをデプロイ
firebase deploy --only functions

# スケジューラーは自動的に設定される
```

### 4. クライアント側の修正

```typescript
// notificationScheduler.ts の修正
class NotificationScheduler {
  // ローカルスケジューリングは削除
  // サーバーからの通知を受信するのみ
  
  async requestServerNotification(userId: string, type: string) {
    // Cloud Functionを呼び出して通知をリクエスト
    const callable = httpsCallable(functions, 'requestNotification');
    await callable({ userId, type });
  }
}
```

### 5. 必要な料金

**Firebase Cloud Functions（Blaze プラン必要）:**
- 無料枠: 125,000回/月の呼び出し
- 超過分: $0.40/100万回

**Cloud Scheduler:**
- 無料枠: 3ジョブまで無料
- 超過分: $0.10/ジョブ/月

**予想月額コスト:**
- 100ユーザー、1日3通知: 約9,000通知/月 = **無料枠内**
- 1000ユーザーの場合: 約90,000通知/月 = **無料枠内**

## 実装の優先順位

1. **まずローカル通知で動作確認**（現在の実装）
2. **Firebase Functions + Cloud Schedulerの基本実装**
3. **パーソナライズされた通知ロジックの実装**
4. **通知分析とA/Bテスト**

## 注意事項

- iOS Safariはウェブプッシュ通知を2023年からサポート開始（iOS 16.4+）
- プッシュ通知にはHTTPS必須
- ユーザーの明示的な許可が必要
- 通知の乱用はユーザー離脱につながる