import { useLocation } from "react-router";

export interface LocationProvider {
  useLocation: () => Location | undefined;
}

export interface PortfolioProps {
  locationProvider: LocationProvider;
}

export const locationProviderImpl: LocationProvider = {
  useLocation: function (): Location {
    return useLocation();
  }
}

export const locationProviderMock: LocationProvider = {
  useLocation: function (): Location | undefined {
    const typeToWorkInTestEnv = undefined;
    return typeToWorkInTestEnv; 
  }
};
