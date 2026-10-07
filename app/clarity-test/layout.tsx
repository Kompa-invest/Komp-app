import "./clarity.css";
import { CtHeader, CtSession } from "./ui";

// Mise en page commune à la rubrique (/clarity-test) et aux tests (/clarity-test/[produit]).
export default function ClarityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ct-root">
      <CtSession>
        <CtHeader />
        {children}
      </CtSession>
    </div>
  );
}
