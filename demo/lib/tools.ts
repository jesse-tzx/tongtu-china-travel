/**
 * Claude tool_use definitions for flyai CLI commands.
 * These map to the 8 flyai CLI commands documented in SKILL.md.
 */
export const tools = [
  {
    name: 'search_flight',
    description:
      'Search for flights between two cities. Use when the user asks about flights, airplanes, or air travel. Parameters must be in Chinese (translate city names before calling). Example: origin="首尔", destination="上海".',
    input_schema: {
      type: 'object' as const,
      properties: {
        origin: {
          type: 'string',
          description: 'Departure city name in Chinese (e.g., 首尔, 北京, 东京)',
        },
        destination: {
          type: 'string',
          description: 'Arrival city name in Chinese (e.g., 上海, 杭州, 西安)',
        },
        dep_date: {
          type: 'string',
          description: 'Departure date in YYYY-MM-DD format',
        },
        seat_class_name: {
          type: 'string',
          description: 'Cabin class: economy, business, or first (optional)',
          enum: ['economy', 'business', 'first'],
        },
        sort_type: {
          type: 'string',
          description:
            'Sort order: 1=price-desc, 2=recommended, 3=price-asc, 4=duration-asc, 6=dep-early (optional, default 3)',
          enum: ['1', '2', '3', '4', '6'],
        },
      },
      required: ['origin', 'destination', 'dep_date'],
    },
  },
  {
    name: 'search_hotel',
    description:
      'Search for hotels near a destination. Use when the user asks about hotels, accommodation, or places to stay. The dest-name parameter must be in Chinese (translate before calling). Example: dest-name="杭州西湖".',
    input_schema: {
      type: 'object' as const,
      properties: {
        dest_name: {
          type: 'string',
          description:
            'Destination name or landmark in Chinese (e.g., 杭州西湖, 北京故宫, 上海外滩)',
        },
      },
      required: ['dest_name'],
    },
  },
  {
    name: 'search_train',
    description:
      'Search for high-speed train tickets between two cities. Use when the user asks about trains, rail, or high-speed rail. Parameters must be in Chinese. Example: origin="北京", destination="上海".',
    input_schema: {
      type: 'object' as const,
      properties: {
        origin: {
          type: 'string',
          description: 'Departure city in Chinese',
        },
        destination: {
          type: 'string',
          description: 'Arrival city in Chinese',
        },
        dep_date: {
          type: 'string',
          description: 'Departure date in YYYY-MM-DD format',
        },
      },
      required: ['origin', 'destination', 'dep_date'],
    },
  },
  {
    name: 'search_poi',
    description:
      'Search for attractions, points of interest, and scenic spots in a city. Use when the user asks about things to do, attractions, sightseeing, or tourist spots. City name must be in Chinese.',
    input_schema: {
      type: 'object' as const,
      properties: {
        city_name: {
          type: 'string',
          description: 'City name in Chinese (e.g., 北京, 上海, 成都)',
        },
        keyword: {
          type: 'string',
          description: 'Specific attraction name to search (optional, e.g., 故宫, 长城)',
        },
        category: {
          type: 'string',
          description: 'Category filter (optional, e.g., 博物馆, 历史古迹, 自然风光)',
        },
        poi_level: {
          type: 'string',
          description: 'Filter by scenic spot rating: 5 for 5A-level attractions (optional)',
        },
      },
      required: ['city_name'],
    },
  },
  {
    name: 'search_marriott_hotel',
    description:
      'Search for Marriott Group hotels (JW Marriott, Sheraton, Ritz-Carlton, Westin, W Hotel, etc.) in a city. Use when the user specifically asks about Marriott or international brand hotels. City name must be in Chinese.',
    input_schema: {
      type: 'object' as const,
      properties: {
        dest_name: {
          type: 'string',
          description: 'Destination city in Chinese (e.g., 上海, 北京, 杭州)',
        },
      },
      required: ['dest_name'],
    },
  },
  {
    name: 'search_marriott_package',
    description:
      'Search for Marriott hotel packages and deals. Use when the user asks about Marriott packages, hotel deals, or bundled offers. Keyword should be in Chinese.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: 'Search keyword in Chinese (e.g., 上海套餐, 亲子套餐)',
        },
      },
      required: ['keyword'],
    },
  },
  {
    name: 'ai_search',
    description:
      'AI-powered semantic travel search for complex queries, comparisons, or when the user intent is vague. Use for: "what to do in Beijing", "A vs B comparisons", "citywalk routes", "food streets", or complex trip planning. Query should be in Chinese.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Natural language travel query in Chinese',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'keyword_search',
    description:
      'General keyword search across all travel categories (flights, hotels, attractions, etc.). Use for broad searches when the user intent is unclear or spans multiple categories. Query should be in Chinese.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query in Chinese',
        },
      },
      required: ['query'],
    },
  },
];
