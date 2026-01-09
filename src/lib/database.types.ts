export interface Database {
    public: {
      Tables: {
        recipes: {
          Row: {
            id: string;
            name: string;
            description: string;
            image_url: string;
        
            ingredients: string[] | null;
            recipe_steps: string[] | null;
            age_group: string | null;
        
            prep_time: number;
            servings: number;
            calories: number;
            protein: number;
            carbs: number;
        
            meal_type: string;
            mood_tags: string[];
            weather_tags: string[];
            allergens: string[];
            created_at: string;
          };
          Insert: Omit<
            Database['public']['Tables']['recipes']['Row'],
            'id' | 'created_at'
          >;
          Update: Partial<
            Database['public']['Tables']['recipes']['Insert']
          >;
        };
        
        user_preferences: {
          Row: {
            id: string;
            session_id: string;
            age_group: string;
            preferred_meal_types: string[];
            allergies: string[];
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['user_preferences']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>;
        };
        common_allergies: {
          Row: {
            id: string;
            name: string;
            description: string;
            created_at: string;
          };
          Insert: Omit<Database['public']['Tables']['common_allergies']['Row'], 'id' | 'created_at'>;
          Update: Partial<Database['public']['Tables']['common_allergies']['Insert']>;
        };
      };
    };
  }
  
  export type Recipe = Database['public']['Tables']['recipes']['Row'];
  export type UserPreference = Database['public']['Tables']['user_preferences']['Row'];
  export type CommonAllergy = Database['public']['Tables']['common_allergies']['Row'];
  