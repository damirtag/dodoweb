import { ReactQueryProvider } from "./providers/react-query";
import { AppRouter } from "./providers/router";

export default function App() {
    return (
        <ReactQueryProvider>
            <AppRouter />
        </ReactQueryProvider>
    );
}
