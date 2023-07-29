export{};
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
        REACT_APP_NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: string;
        REACT_APP_TRANSLINK_API: string;
        // add more environment variables and their types here
      }
    }
  }