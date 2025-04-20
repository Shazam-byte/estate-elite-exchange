export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          location: string;
          image_urls: string[];
          agent_id: string;
          created_at: string;
          status: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          name: string;
          phone: string;
          created_at: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
      };
    };
  };
} 