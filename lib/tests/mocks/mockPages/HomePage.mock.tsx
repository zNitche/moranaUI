import { useSearchParams } from "#root/routing";

export default function HomePageMock() {
    const searchParams = useSearchParams<Record<string, string>>();

    return (
        <div data-testid="home-page">home: {JSON.stringify(searchParams)}</div>
    );
}
