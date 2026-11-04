export default interface RouterCurrentRoute {
    uuid?: string;
    pathParams?: Record<string, string>;
    navigationImportance?: number;
}
