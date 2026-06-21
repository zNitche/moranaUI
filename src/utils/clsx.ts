export default function clsx(...args: (string | undefined | false)[]): string {
    return args.filter((x) => x).join(" ");
}
