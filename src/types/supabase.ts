export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      AttendanceRecord: {
        Row: {
          createdAt: string | null
          date: string | null
          id: string
          inTime: string | null
          outTime: string | null
          status: string | null
          userId: string
        }
        Insert: {
          createdAt?: string | null
          date?: string | null
          id?: string
          inTime?: string | null
          outTime?: string | null
          status?: string | null
          userId: string
        }
        Update: {
          createdAt?: string | null
          date?: string | null
          id?: string
          inTime?: string | null
          outTime?: string | null
          status?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Attendance_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Departement: {
        Row: {
          createdAt: string
          id: string
          name: string
        }
        Insert: {
          createdAt: string
          id?: string
          name: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      FaceData: {
        Row: {
          createdAt: string
          descriptor: Json | null
          id: string
          name: string
          userId: string | null
        }
        Insert: {
          createdAt?: string
          descriptor?: Json | null
          id?: string
          name: string
          userId?: string | null
        }
        Update: {
          createdAt?: string
          descriptor?: Json | null
          id?: string
          name?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FaceData_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Mahasiswa: {
        Row: {
          created_at: string
          id: number
          nama: string | null
          nim: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nama?: string | null
          nim?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nama?: string | null
          nim?: string | null
        }
        Relationships: []
      }
      RoomEntryRecord: {
        Row: {
          capturedAt: string | null
          createdAt: string
          id: string
          isRecognized: boolean | null
          userId: string | null
        }
        Insert: {
          capturedAt?: string | null
          createdAt?: string
          id?: string
          isRecognized?: boolean | null
          userId?: string | null
        }
        Update: {
          capturedAt?: string | null
          createdAt?: string
          id?: string
          isRecognized?: boolean | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "RoomEntryRecord_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      UnknownFaceRecord: {
        Row: {
          faceDescriptor: Json | null
          faceImage: string | null
          id: string
          notes: string | null
          timestamp: string | null
        }
        Insert: {
          faceDescriptor?: Json | null
          faceImage?: string | null
          id?: string
          notes?: string | null
          timestamp?: string | null
        }
        Update: {
          faceDescriptor?: Json | null
          faceImage?: string | null
          id?: string
          notes?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          authId: string
          createdAt: string
          departement: string | null
          email: string
          id: string
          imageId: string | null
          imageUrl: string | null
          name: string | null
          NIK: number | null
          password: string | null
          position: string | null
          role: string | null
          status: string | null
          updatedAt: string | null
        }
        Insert: {
          authId: string
          createdAt?: string
          departement?: string | null
          email: string
          id?: string
          imageId?: string | null
          imageUrl?: string | null
          name?: string | null
          NIK?: number | null
          password?: string | null
          position?: string | null
          role?: string | null
          status?: string | null
          updatedAt?: string | null
        }
        Update: {
          authId?: string
          createdAt?: string
          departement?: string | null
          email?: string
          id?: string
          imageId?: string | null
          imageUrl?: string | null
          name?: string | null
          NIK?: number | null
          password?: string | null
          position?: string | null
          role?: string | null
          status?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_departement_fkey"
            columns: ["departement"]
            isOneToOne: false
            referencedRelation: "Departement"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
