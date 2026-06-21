import { useRouter } from "moranaui"

export default function CatchAppPage() {
    const {navigateTo} = useRouter();

    return <div>
        <div onClick={() => navigateTo("/")}>go home</div>
    </div>
}