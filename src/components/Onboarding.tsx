import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CommonAllergy } from '../lib/database.types';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  ageGroup: string;
  mealTypes: string[];
  allergies: string[];
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState('');
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [availableAllergies, setAvailableAllergies] = useState<CommonAllergy[]>([]);

  useEffect(() => {
    loadAllergies();
  }, []);

  async function loadAllergies() {
    const { data } = await supabase
      .from('common_allergies')
      .select('*')
      .order('name');

    if (data) {
      setAvailableAllergies(data);
    }
  }

  const ageGroups = [
    { value: 'child', label: 'Child (5-12)', emoji: '🧒' },
    { value: 'teen', label: 'Teen (13-19)', emoji: '👦' },
    { value: 'adult', label: 'Adult (20-59)', emoji: '👨' },
    { value: 'senior', label: 'Senior (60+)', emoji: '👴' },
  ];

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snacks', emoji: '🍿' },
    { value: 'beverage', label: 'Beverages', emoji: '☕' },
  ];

  const toggleMealType = (type: string) => {
    setMealTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleNext = () => {
    if (step === 1 && ageGroup) setStep(2);
    else if (step === 2 && mealTypes.length > 0) setStep(3);
  };

  const handleComplete = () => {
    onComplete({ ageGroup, mealTypes, allergies });
  };

  const canProceed = () => {
    if (step === 1) return ageGroup !== '';
    if (step === 2) return mealTypes.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full mx-1 transition-all duration-300 ${
                    s <= step ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">
              Step {step} of 3
            </p>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Select Your Age Group
              </h2>
              <p className="text-gray-600 mb-6">
                This helps us provide age-appropriate meal suggestions
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ageGroups.map((group) => (
                  <button
                    key={group.value}
                    onClick={() => setAgeGroup(group.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      ageGroup === group.value
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl mb-2">{group.emoji}</div>
                    <div className="font-semibold text-gray-900">{group.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Preferred Meal Types
              </h2>
              <p className="text-gray-600 mb-6">
                Select a meal types you're interested in
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mealTypeOptions.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleMealType(type.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      mealTypes.includes(type.value)
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Any Allergies?
              </h2>
              <p className="text-gray-600 mb-6">
                Select any allergies to filter out incompatible recipes (optional)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {availableAllergies.map((allergy) => (
                  <button
                    key={allergy.id}
                    onClick={() => toggleAllergy(allergy.name)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      allergies.includes(allergy.name)
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {allergy.name}
                    </div>
                  </button>
                ))}
              </div>

              {allergies.length === 0 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  No allergies selected. All recipes will be shown.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
