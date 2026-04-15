import { useState } from 'react';
import useNutritionStore, { DAILY_GOALS } from '../../store/useNutritionStore';
import { SlideUp, FadeIn } from '../UI/AnimatedCard.jsx';

const MEAL_TYPES = [
  { id: 'breakfast', label: '🌅 Kahvaltı', icon: '🍳' },
  { id: 'lunch', label: '🌞 Öğle Yemeği', icon: '🍽️' },
  { id: 'dinner', label: '🌙 Akşam Yemeği', icon: '🍲' },
  { id: 'snack', label: '🍪 Atıştırmalık', icon: '🥨' },
];

const QUICK_ADD_FOODS = [
  { name: 'Tavuk Göğsü (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Pirinç (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Yumurta (1 adet)', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Brokoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Muhannara (100g)', calories: 280, protein: 20, carbs: 35, fat: 8 },
  { name: 'Beyaz Peynir (100g)', calories: 200, protein: 12, carbs: 3, fat: 15 },
];

function MacroRing({ value, goal, color, label, unit }) {
  const percentage = Math.min(100, Math.round((value / goal) * 100));
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            strokeWidth="6"
            fill="none"
            className="stroke-white/10"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            strokeWidth="6"
            fill="none"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <span className="text-xs text-white/50 mt-1">{label}</span>
      <span className="text-xs text-white/30">{value}/{goal}{unit}</span>
    </div>
  );
}

function WaterTracker({ current, goal, onAdd }) {
  const percentage = Math.round((current / goal) * 100);

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">💧 Su Takibi</h3>
        <span className="text-xs text-[#3B82F6]">{current}ml / {goal}ml</span>
      </div>

      <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      <div className="flex gap-2">
        {[250, 500, 750].map((ml) => (
          <button
            key={ml}
            onClick={() => onAdd(ml)}
            className="flex-1 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl text-xs font-medium text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-colors"
          >
            +{ml}ml
          </button>
        ))}
      </div>
    </div>
  );
}

function MealCard({ meal, onEdit, onDelete }) {
  return (
    <div className="bg-bg-card border border-white/10 rounded-xl p-3 mb-2">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-white">{meal.name}</p>
          <p className="text-xs text-white/50">{meal.portion || '1 porsiyon'}</p>
        </div>
        <span className="text-sm font-bold text-[#14B8A6]">{meal.calories} kcal</span>
      </div>
      <div className="flex gap-3 text-xs text-white/40">
        <span>P: {meal.protein}g</span>
        <span>K: {meal.carbs}g</span>
        <span>Y: {meal.fat}g</span>
      </div>
    </div>
  );
}

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [mealForm, setMealForm] = useState({
    name: '',
    portion: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const { getDailyTotals, getGoalProgress, getMeals, getWater, addWater, logMeal } = useNutritionStore();

  const totals = getDailyTotals(selectedDate);
  const progress = getGoalProgress(selectedDate);
  const meals = getMeals(selectedDate);
  const water = getWater(selectedDate);

  const handleAddWater = (ml) => {
    addWater(selectedDate, ml);
  };

  const handleQuickAdd = (food) => {
    logMeal(selectedDate, {
      ...food,
      mealType: selectedMealType,
      date: selectedDate,
    });
    setShowAddModal(false);
  };

  const handleSubmitMeal = (e) => {
    e.preventDefault();
    if (!mealForm.name || !mealForm.calories) return;

    logMeal(selectedDate, {
      name: mealForm.name,
      portion: mealForm.portion,
      calories: parseInt(mealForm.calories),
      protein: parseInt(mealForm.protein) || 0,
      carbs: parseInt(mealForm.carbs) || 0,
      fat: parseInt(mealForm.fat) || 0,
      mealType: selectedMealType,
      date: selectedDate,
    });

    setMealForm({ name: '', portion: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowAddModal(false);
  };

  const mealsByType = MEAL_TYPES.map((type) => ({
    ...type,
    meals: meals.filter((m) => m.mealType === type.id),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <SlideUp>
        <h1 className="text-2xl font-bold text-white mb-4">🥗 Beslenme</h1>
      </SlideUp>

      {/* Macro Summary */}
      <SlideUp delay={0.05}>
        <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Günlük Hedef</h3>
            <span className="text-xs text-white/50">
              {new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </span>
          </div>

          <div className="flex justify-around mb-4">
            <MacroRing
              value={totals.calories}
              goal={DAILY_GOALS.calories}
              color="#E94560"
              label="Kalori"
              unit="kcal"
            />
            <MacroRing
              value={totals.protein}
              goal={DAILY_GOALS.protein}
              color="#14B8A6"
              label="Protein"
              unit="g"
            />
            <MacroRing
              value={totals.carbs}
              goal={DAILY_GOALS.carbs}
              color="#F59E0B"
              label="Karbo"
              unit="g"
            />
            <MacroRing
              value={totals.fat}
              goal={DAILY_GOALS.fat}
              color="#8B5CF6"
              label="Yağ"
              unit="g"
            />
          </div>

          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E94560] via-[#F59E0B] to-[#14B8A6] rounded-full"
              style={{ width: `${Math.min(100, (totals.calories / DAILY_GOALS.calories) * 100)}%` }}
            />
          </div>
        </div>
      </SlideUp>

      {/* Water Tracker */}
      <SlideUp delay={0.1}>
        <WaterTracker current={water} goal={DAILY_GOALS.water} onAdd={handleAddWater} />
      </SlideUp>

      {/* Add Meal Button */}
      <SlideUp delay={0.15}>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-xl text-sm font-medium text-[#14B8A6] hover:bg-[#14B8A6]/20 transition-colors mb-4"
        >
          + Yemek Ekle
        </button>
      </SlideUp>

      {/* Meals by Type */}
      <SlideUp delay={0.2}>
        <div className="space-y-4">
          {mealsByType.map((mealType) => (
            <div key={mealType.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{mealType.icon}</span>
                <h3 className="text-sm font-semibold text-white">{mealType.label}</h3>
                {mealType.meals.length > 0 && (
                  <span className="text-xs text-[#14B8A6]">
                    {mealType.meals.reduce((sum, m) => sum + m.calories, 0)} kcal
                  </span>
                )}
              </div>
              {mealType.meals.length > 0 ? (
                mealType.meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))
              ) : (
                <p className="text-xs text-white/30 mb-2 pl-7">Henüz eklenmedi</p>
              )}
            </div>
          ))}
        </div>
      </SlideUp>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-bg-card border border-white/10 rounded-t-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Yemek Ekle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Meal Type Selection */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedMealType(type.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedMealType === type.id
                      ? 'bg-[#14B8A6] text-white'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {type.icon} {type.label.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* Quick Add */}
            <div className="mb-4">
              <p className="text-xs text-white/50 mb-2">Hızlı Ekle</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {QUICK_ADD_FOODS.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => handleQuickAdd(food)}
                    className="flex-shrink-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/10 transition-colors"
                  >
                    {food.name.split(' ')[0]} {food.name.split(' ')[1]}
                    <span className="block text-[#14B8A6]">{food.calories} kcal</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Entry */}
            <form onSubmit={handleSubmitMeal} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Yemek adı"
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Kalori"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={mealForm.protein}
                  onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Karbonhidrat (g)"
                  value={mealForm.carbs}
                  onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Yağ (g)"
                  value={mealForm.fat}
                  onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#14B8A6] rounded-xl text-sm font-bold text-white"
              >
                Ekle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
