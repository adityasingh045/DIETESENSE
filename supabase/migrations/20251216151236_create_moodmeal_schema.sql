CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  prep_time integer DEFAULT 0,
  servings integer DEFAULT 1,
  calories integer DEFAULT 0,
  protein integer DEFAULT 0,
  carbs integer DEFAULT 0,
  meal_type text NOT NULL,
  mood_tags text[] DEFAULT '{}',
  weather_tags text[] DEFAULT '{}',
  allergens text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);


CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  age_group text DEFAULT '',
  preferred_meal_types text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);


CREATE TABLE IF NOT EXISTS common_allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);


ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE common_allergies ENABLE ROW LEVEL SECURITY;


ALTER TABLE recipes
ADD COLUMN ingredients text[] DEFAULT '{}',
ADD COLUMN recipe_steps text[] DEFAULT '{}',
ADD COLUMN age_group text DEFAULT 'all';



CREATE POLICY "Anyone can view recipes"
  ON recipes FOR SELECT
  TO anon, authenticated
  USING (true);


CREATE POLICY "Anyone can view common allergies"
  ON common_allergies FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_recipes_mood_tags ON recipes USING GIN (mood_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_weather_tags ON recipes USING GIN (weather_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes (meal_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences (session_id);

-- Insert common allergies
INSERT INTO common_allergies (name, description) VALUES
  ('Dairy', 'Milk and milk-based products'),
  ('Eggs', 'Eggs and egg-containing products'),
  ('Peanuts', 'Peanuts and peanut products'),
  ('Tree Nuts', 'Almonds, walnuts, cashews, etc.'),
  ('Soy', 'Soybeans and soy products'),
  ('Wheat', 'Wheat and wheat-containing products'),
  ('Fish', 'Fish and fish products'),
  ('Shellfish', 'Shrimp, crab, lobster, etc.'),
  ('Gluten', 'Gluten-containing grains'),
  ('Sesame', 'Sesame seeds and sesame products')
ON CONFLICT (name) DO NOTHING;

-- Insert sample recipes
INSERT INTO recipes (name, description, image_url, prep_time, servings, calories, protein, carbs, meal_type, mood_tags, weather_tags, allergens) VALUES
  ('Filter Coffee', 'Traditional South Indian filter coffee made with freshly brewed coffee decoction and hot milk', 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800', 10, 1, 0, 0, 0, 'beverage', ARRAY['happy', 'focused', 'energetic'], ARRAY['cold', 'rainy'], ARRAY['Dairy']),
  
  ('Watermelon Juice', 'Refreshing and hydrating watermelon juice perfect for hot weather', 'https://images.pexels.com/photos/1435740/pexels-photo-1435740.jpeg?auto=compress&cs=tinysrgb&w=800', 0, 1, 0, 0, 0, 'beverage', ARRAY['happy', 'energetic'], ARRAY['hot', 'sunny'], ARRAY[]::text[]),
  
  ('Masala Dosa', 'A crispy fermented rice crepe filled with spiced potato masala, served hot with chutney and sambar', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800', 45, 2, 320, 8, 54, 'breakfast', ARRAY['happy', 'comfort', 'energetic'], ARRAY['cold', 'rainy', 'cloudy'], ARRAY['Gluten']),
  
  ('Paneer Butter Masala', 'Creamy and rich North Indian curry with soft paneer cubes in tomato-based gravy', 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800', 30, 4, 380, 18, 22, 'lunch', ARRAY['comfort', 'romantic', 'happy'], ARRAY['cold', 'rainy'], ARRAY['Dairy']),
  
  ('Chicken Biryani', 'Aromatic basmati rice layered with spiced chicken and slow-cooked to perfection', 'https://images.pexels.com/photos/8104708/pexels-photo-8104708.jpeg?auto=compress&cs=tinysrgb&w=800', 60, 4, 450, 28, 58, 'lunch', ARRAY['happy', 'comfort', 'energetic'], ARRAY['cold', 'cloudy'], ARRAY['Dairy']),
  
  ('Green Salad Bowl', 'Fresh mix of lettuce, cucumber, tomatoes, and olives with olive oil dressing', 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800', 10, 2, 120, 3, 18, 'lunch', ARRAY['focused', 'energetic', 'happy'], ARRAY['hot', 'sunny'], ARRAY[]::text[]),
  
  ('Idli Sambar', 'Soft steamed rice cakes served with lentil-based vegetable stew', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 3, 180, 6, 38, 'breakfast', ARRAY['comfort', 'focused', 'happy'], ARRAY['rainy', 'cold'], ARRAY[]::text[]),
  
  ('Chocolate Smoothie', 'Rich chocolate smoothie with banana and almond milk', 'https://images.pexels.com/photos/775030/pexels-photo-775030.jpeg?auto=compress&cs=tinysrgb&w=800', 5, 1, 280, 8, 42, 'beverage', ARRAY['sad', 'romantic', 'comfort'], ARRAY['cold', 'cloudy'], ARRAY['Tree Nuts']),
  
  ('Grilled Sandwich', 'Toasted sandwich with cheese, tomatoes, and herbs', 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=800', 15, 1, 320, 12, 38, 'snack', ARRAY['happy', 'energetic', 'focused'], ARRAY['cold', 'rainy'], ARRAY['Dairy', 'Wheat', 'Gluten']),
  
  ('Dal Tadka', 'Yellow lentils tempered with spices, garlic, and ghee', 'https://images.pexels.com/photos/2365945/pexels-photo-2365945.jpeg?auto=compress&cs=tinysrgb&w=800', 25, 4, 220, 14, 32, 'dinner', ARRAY['comfort', 'focused', 'happy'], ARRAY['cold', 'rainy'], ARRAY['Dairy']),
  
  ('Fresh Fruit Salad', 'Mix of seasonal fruits with honey and mint', 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800', 10, 2, 150, 2, 36, 'snack', ARRAY['energetic', 'happy', 'focused'], ARRAY['hot', 'sunny'], ARRAY[]::text[]),
  
  ('Hot Chocolate', 'Warm, comforting hot chocolate with marshmallows', 'https://images.pexels.com/photos/4224099/pexels-photo-4224099.jpeg?auto=compress&cs=tinysrgb&w=800', 10, 1, 320, 8, 48, 'beverage', ARRAY['sad', 'comfort', 'romantic'], ARRAY['cold', 'rainy'], ARRAY['Dairy']),
  
  ('Veg Pulao', 'Fragrant rice cooked with mixed vegetables and whole spices', 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=800', 30, 4, 280, 6, 52, 'lunch', ARRAY['comfort', 'happy', 'focused'], ARRAY['cold', 'cloudy'], ARRAY[]::text[]),
  
  ('Mango Lassi', 'Creamy yogurt-based drink blended with fresh mangoes', 'https://images.pexels.com/photos/5945735/pexels-photo-5945735.jpeg?auto=compress&cs=tinysrgb&w=800', 5, 1, 180, 6, 32, 'beverage', ARRAY['happy', 'romantic', 'comfort'], ARRAY['hot', 'sunny'], ARRAY['Dairy']),
  
  ('Poha', 'Flattened rice cooked with onions, peanuts, and spices', 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=800', 15, 2, 220, 5, 42, 'breakfast', ARRAY['energetic', 'happy', 'focused'], ARRAY['cloudy', 'rainy'], ARRAY['Peanuts'])
ON CONFLICT DO NOTHING;

UPDATE recipes
SET
  ingredients = ARRAY[
    'Coffee powder',
    'Hot water',
    'Milk',
    'Sugar'
  ],
  recipe_steps = ARRAY[
    'Prepare coffee decoction',
    'Boil milk',
    'Mix decoction with hot milk',
    'Add sugar and serve hot'
  ],
  age_group = 'adult'
WHERE name = 'Filter Coffee';
