import { useLocation } from "react-router";

export interface LocationProvider {
  useLocation: () => Location | undefined;
}

export interface PortfolioProps {
  isTestEnv?: boolean;
  locationProvider: LocationProvider;
}

export const locationProviderImpl: LocationProvider = {
  useLocation: function (): Location {
    return useLocation();
  }
}


export const mockLocationProvider: LocationProvider = {
  useLocation: function (): Location | undefined {
    return undefined;
  }
};
