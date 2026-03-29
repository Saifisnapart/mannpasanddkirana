export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null
          country: string
          created_at: string
          full_address: string
          id: string
          is_default: boolean
          label: string
          latitude: number | null
          longitude: number | null
          pincode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          country?: string
          created_at?: string
          full_address: string
          id?: string
          is_default?: boolean
          label: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string
          full_address?: string
          id?: string
          is_default?: boolean
          label?: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          created_at: string
          currency_code: string
          exchange_rate_to_inr: number
          id: string
          is_active: boolean
          is_base: boolean
          name: string
        }
        Insert: {
          created_at?: string
          currency_code: string
          exchange_rate_to_inr?: number
          id?: string
          is_active?: boolean
          is_base?: boolean
          name: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          exchange_rate_to_inr?: number
          id?: string
          is_active?: boolean
          is_base?: boolean
          name?: string
        }
        Relationships: []
      }
      delivery_partners: {
        Row: {
          created_at: string
          fuel_type: string | null
          id: string
          is_default_for_strait: boolean
          name: string
          tagline: string | null
        }
        Insert: {
          created_at?: string
          fuel_type?: string | null
          id?: string
          is_default_for_strait?: boolean
          name: string
          tagline?: string | null
        }
        Update: {
          created_at?: string
          fuel_type?: string | null
          id?: string
          is_default_for_strait?: boolean
          name?: string
          tagline?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          native_name: string
          rtl: boolean
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          native_name: string
          rtl?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          native_name?: string
          rtl?: boolean
        }
        Relationships: []
      }
      locations: {
        Row: {
          country: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          type: Database["public"]["Enums"]["location_type"]
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          type?: Database["public"]["Enums"]["location_type"]
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          type?: Database["public"]["Enums"]["location_type"]
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total_inr: number
          order_id: string
          product_name: string
          quantity_in_base_unit: number
          store_product_id: string
          unit_price_inr: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total_inr: number
          order_id: string
          product_name: string
          quantity_in_base_unit: number
          store_product_id: string
          unit_price_inr: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total_inr?: number
          order_id?: string
          product_name?: string
          quantity_in_base_unit?: number
          store_product_id?: string
          unit_price_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_store_product_id_fkey"
            columns: ["store_product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          currency_id: string | null
          customer_id: string
          delivered_at: string | null
          delivery_partner_id: string | null
          driver_name: string | null
          driver_phone: string | null
          id: string
          notes: string | null
          out_for_delivery_at: string | null
          packed_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          picked_up_at: string | null
          placed_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          store_id: string
          total_display: string | null
          total_inr: number
        }
        Insert: {
          address_id?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency_id?: string | null
          customer_id: string
          delivered_at?: string | null
          delivery_partner_id?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          notes?: string | null
          out_for_delivery_at?: string | null
          packed_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          picked_up_at?: string | null
          placed_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store_id: string
          total_display?: string | null
          total_inr?: number
        }
        Update: {
          address_id?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency_id?: string | null
          customer_id?: string
          delivered_at?: string | null
          delivery_partner_id?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          notes?: string | null
          out_for_delivery_at?: string | null
          packed_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          picked_up_at?: string | null
          placed_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store_id?: string
          total_display?: string | null
          total_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price_inr: number
          base_unit: Database["public"]["Enums"]["base_unit"]
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          max_order_qty: number
          min_order_qty: number
          name: string
          religion_tag: string | null
          season_tag: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          base_price_inr?: number
          base_unit?: Database["public"]["Enums"]["base_unit"]
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          max_order_qty?: number
          min_order_qty?: number
          name: string
          religion_tag?: string | null
          season_tag?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          base_price_inr?: number
          base_unit?: Database["public"]["Enums"]["base_unit"]
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          max_order_qty?: number
          min_order_qty?: number
          name?: string
          religion_tag?: string | null
          season_tag?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          buyer_type: Database["public"]["Enums"]["buyer_type"]
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          preferred_currency_id: string | null
          preferred_language_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          buyer_type?: Database["public"]["Enums"]["buyer_type"]
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          preferred_currency_id?: string | null
          preferred_language_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          buyer_type?: Database["public"]["Enums"]["buyer_type"]
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          preferred_currency_id?: string | null
          preferred_language_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_currency_id_fkey"
            columns: ["preferred_currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_preferred_language_id_fkey"
            columns: ["preferred_language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          max_order_qty: number | null
          min_order_qty: number | null
          product_id: string
          stock_quantity: number
          store_id: string
          updated_at: string
          vendor_price_inr: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          max_order_qty?: number | null
          min_order_qty?: number | null
          product_id: string
          stock_quantity?: number
          store_id: string
          updated_at?: string
          vendor_price_inr: number
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          max_order_qty?: number | null
          min_order_qty?: number | null
          product_id?: string
          stock_quantity?: number
          store_id?: string
          updated_at?: string
          vendor_price_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "store_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          credit_radius_km: number
          id: string
          is_active: boolean
          latitude: number
          location_id: string | null
          longitude: number
          name: string
          owner_id: string
          service_radius_km: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          credit_radius_km?: number
          id?: string
          is_active?: boolean
          latitude: number
          location_id?: string | null
          longitude: number
          name: string
          owner_id: string
          service_radius_km?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          credit_radius_km?: number
          id?: string
          is_active?: boolean
          latitude?: number
          location_id?: string | null
          longitude?: number
          name?: string
          owner_id?: string
          service_radius_km?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_credit_eligibility: {
        Args: { user_lat: number; user_lng: number }
        Returns: boolean
      }
      get_nearby_stores: {
        Args: { radius_km?: number; user_lat: number; user_lng: number }
        Returns: {
          distance_km: number
          store_id: string
          store_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "vendor" | "admin"
      base_unit: "gm" | "kg" | "piece" | "litre" | "ml"
      buyer_type: "one_time" | "frequent" | "ratib"
      location_type: "city" | "region" | "strait"
      order_status:
        | "placed"
        | "confirmed"
        | "packed"
        | "picked_up"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      payment_method: "online" | "cod" | "credit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "vendor", "admin"],
      base_unit: ["gm", "kg", "piece", "litre", "ml"],
      buyer_type: ["one_time", "frequent", "ratib"],
      location_type: ["city", "region", "strait"],
      order_status: [
        "placed",
        "confirmed",
        "packed",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_method: ["online", "cod", "credit"],
    },
  },
} as const
