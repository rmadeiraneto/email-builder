/**
 * Token Context for providing custom tokens to styleguide components
 */

import { createContext, useContext, ParentComponent } from 'solid-js';
import { CustomTokens } from '../utils/tokenStorage';

interface TokenContextValue {
  customTokens: CustomTokens;
  getToken: (path: string[]) => any;
}

const TokenContext = createContext<TokenContextValue>();

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within TokenProvider');
  }
  return context;
}

interface TokenProviderProps {
  customTokens: CustomTokens;
}

export const TokenProvider: ParentComponent<TokenProviderProps> = (props) => {
  const getToken = (path: string[]): any => {
    let current: any = props.customTokens;

    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  };

  const contextValue: TokenContextValue = {
    customTokens: props.customTokens,
    getToken,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {props.children}
    </TokenContext.Provider>
  );
};
