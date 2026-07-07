import { useLocation } from "react-router";

export interface LocationProvider {
  useLocation: () => Location | undefined;
}

export interface PortfolioProps {
  locationProvider: LocationProvider;
  isTestEnv?: boolean | null;
}

export const locationProviderImpl: LocationProvider = {
  useLocation: function (): Location {
    // @ts-ignore
    return useLocation();
  }
}

export const locationProviderMock: LocationProvider = {
  useLocation: function (): Location | undefined {
    const typeToWorkInTestEnv = undefined;
    return typeToWorkInTestEnv; 
  }
};
