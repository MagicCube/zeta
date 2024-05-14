export interface SERPSearchResult {
  search_metadata: SERPSearchMeta;
  search_parameters: SERPSearchParameters;
  search_information: SERPSearchInformation;
  organic_results: SERPOrganicResult[];
  knowledge_graph: SERPKnowledgeGraph;
  answer_box: SERPAnswerBox;
  related_search: {
    query: string;
  };
}

export interface SERPSearchMeta {
  id: string;
  status: 'Success' | 'Error';
  created_at: string;
  processed_at: string;
  total_time_taken: string;
}

export interface SERPSearchParameters {
  engine: string;
  q: string;
  location_requested: string;
  location_used: string;
  google_domain: string;
  hl: string;
  gl: string;
  device: string;
}

export interface SERPOrganicResult {
  position: number;
  title: string;
  link: string;
  favicon: string;
  date: string;
  snippet: string;
  source: string;
}

export interface SERPSearchInformation {
  query_displayed: string;
  total_results: number;
  time_taken_displayed: number;
  organic_results_state:
    | 'Results for exact spelling'
    | 'Empty showing fixed spelling results'
    | 'Some results for exact spelling but showing fixed spelling'
    | 'Showing results for exact spelling despite spelling suggestion'
    | 'Fully empty';
}

export interface SERPKnowledgeGraph {
  title: string;
  type: string;
  entity_type: string;
  image?: string;
  description: string;
  source: {
    name: string;
    link: string;
  };
}

export interface SERPGenericAnswerBox<T extends string> {
  type: T;
}

export interface SERPCalculatorResult
  extends SERPGenericAnswerBox<'calculator_result'> {
  result: string;
}

export interface SERPWeatherResult
  extends SERPGenericAnswerBox<'calculator_result'> {
  temperature: string;
  unit: string;
  precipitation: string;
  humidity: string;
  wind: string;
  location: string;
  date: string;
  weather: string;
  thumbnail: string;
  forecast: SERPWeatherForecast[];
}

export interface SERPWeatherForecast {
  day: string;
  weather: string;
  temperature: {
    high: string;
    low: string;
  };
  thumbnail: string;
  precipitation: string;
  humidity: string;
  wind: string;
}

// https://serpapi.com/direct-answer-box-api
export type SERPAnswerBox = SERPCalculatorResult | SERPWeatherResult;
