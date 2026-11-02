import { usePathParams } from "#root/routing";

export default function ParamsPageMock() {
    const params = usePathParams<{ id: string; id2: string }>();

    return (
        <div data-testid="params-page">{`/params/${params?.id}/path/${params?.id2}`}</div>
    );
}
