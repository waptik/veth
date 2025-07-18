import { useState } from "react";

import {
  createTrpcClient,
  getQueryClient,
  TRPCProvider,
} from "../utils/trpc-client";

const TRPCReactProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() => createTrpcClient());
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  );
};

export default TRPCReactProvider;
