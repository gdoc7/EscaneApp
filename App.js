import React from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import Main from "./src/components/Main";
import { queryClient } from "./src/services/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
