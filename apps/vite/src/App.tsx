import { useQuery } from "@tanstack/react-query";

import { Counter, Header } from "@repo/ui";

import { useTRPC } from "./utils/trpc-client";
import typescriptLogo from "/typescript.svg";

const App = () => {
  const trpc = useTRPC();
  const greetingsQuery = useQuery(trpc.app.hello.queryOptions({ name: "Joe" }));

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img
          src={typescriptLogo}
          className="logo vanilla"
          alt="TypeScript logo"
        />
      </a>
      <Header title="Web" />
      <p>{greetingsQuery.data?.greeting}</p>

      <div className="card">
        <Counter />
      </div>
    </div>
  );
};

export default App;
