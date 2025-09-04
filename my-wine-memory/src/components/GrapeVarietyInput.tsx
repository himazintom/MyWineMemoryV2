import React, { useState, useEffect } from 'react';

interface GrapeVariety {
  name: string;
  percentage: number;
}

interface GrapeVarietyInputProps {
  value: GrapeVariety[];
  onChange: (varieties: GrapeVariety[]) => void;
  placeholder?: string;
}

const GrapeVarietyInput: React.FC<GrapeVarietyInputProps> = ({
  value = [],
  onChange,
  placeholder = "ブドウ品種を入力してEnterで追加"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPercentageWarning, setShowPercentageWarning] = useState(false);

  // Calculate total percentage
  const totalPercentage = value.reduce((sum, variety) => sum + variety.percentage, 0);

  useEffect(() => {
    // Show warning if total is not 100% and there are varieties
    setShowPercentageWarning(value.length > 0 && totalPercentage !== 100);
  }, [totalPercentage, value.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addVariety();
    }
  };

  const addVariety = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.some(v => v.name === trimmedValue)) {
      const newPercentage = value.length === 0 ? 100 : Math.round(100 / (value.length + 1));
      
      // Add new variety
      const newVarieties = [
        ...value.map(v => ({ ...v, percentage: Math.round(100 / (value.length + 1)) })),
        { name: trimmedValue, percentage: newPercentage }
      ];
      
      // Adjust percentages to ensure they sum to 100
      adjustPercentages(newVarieties);
      setInputValue('');
    }
  };

  const removeVariety = (indexToRemove: number) => {
    const newVarieties = value.filter((_, index) => index !== indexToRemove);
    if (newVarieties.length > 0) {
      // Redistribute percentages equally
      const equalPercentage = Math.floor(100 / newVarieties.length);
      const remainder = 100 - (equalPercentage * newVarieties.length);
      
      newVarieties.forEach((variety, index) => {
        variety.percentage = equalPercentage + (index === 0 ? remainder : 0);
      });
    }
    onChange(newVarieties);
  };

  const handlePercentageChange = (index: number, newPercentage: number) => {
    const updatedVarieties = [...value];
    updatedVarieties[index].percentage = Math.min(100, Math.max(0, newPercentage));
    onChange(updatedVarieties);
  };

  const adjustPercentages = (varieties: GrapeVariety[]) => {
    if (varieties.length === 0) return;
    
    const total = varieties.reduce((sum, v) => sum + v.percentage, 0);
    if (total === 100) {
      onChange(varieties);
      return;
    }
    
    // Adjust last variety to make total 100%
    const adjustment = 100 - total;
    const lastIndex = varieties.length - 1;
    varieties[lastIndex].percentage = Math.max(0, varieties[lastIndex].percentage + adjustment);
    
    onChange(varieties);
  };

  const autoBalance = () => {
    if (value.length === 0) return;
    
    const equalPercentage = Math.floor(100 / value.length);
    const remainder = 100 - (equalPercentage * value.length);
    
    const balancedVarieties = value.map((variety, index) => ({
      ...variety,
      percentage: equalPercentage + (index === 0 ? remainder : 0)
    }));
    
    onChange(balancedVarieties);
  };

  return (
    <div className="grape-variety-input-container">
      <div className="grape-variety-add-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addVariety}
          placeholder={placeholder}
          className="grape-variety-text-input"
        />
        {value.length > 0 && (
          <button 
            type="button" 
            className="auto-balance-btn"
            onClick={autoBalance}
            title="配合を均等にする"
          >
            ⚖️ 均等配分
          </button>
        )}
      </div>

      {value.length > 0 && (
        <div className="grape-varieties-list">
          {value.map((variety, index) => (
            <div key={index} className="grape-variety-item">
              <div className="variety-header">
                <span className="variety-name">{variety.name}</span>
                <button
                  type="button"
                  className="variety-remove"
                  onClick={() => removeVariety(index)}
                >
                  ×
                </button>
              </div>
              <div className="variety-percentage">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={variety.percentage}
                  onChange={(e) => handlePercentageChange(index, parseInt(e.target.value))}
                  className="percentage-slider"
                />
                <div className="percentage-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={variety.percentage}
                    onChange={(e) => handlePercentageChange(index, parseInt(e.target.value) || 0)}
                    className="percentage-number"
                  />
                  <span className="percentage-symbol">%</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className={`percentage-total ${showPercentageWarning ? 'warning' : 'valid'}`}>
            <span>合計: {totalPercentage}%</span>
            {showPercentageWarning && (
              <span className="warning-text">（合計を100%にしてください）</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrapeVarietyInput;