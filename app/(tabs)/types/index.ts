export type Props = any;

export interface EquationPart {
  text: string;
  color: string;
}

export interface HeroConfig {
  equationParts: EquationPart[];
  detail: string;
}

export interface Category {
  key: string;
  screen: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  description: string;
  hero?: HeroConfig;
  examples: string[];
}
