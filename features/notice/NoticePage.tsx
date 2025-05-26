import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function NoticePage() {
    return (

        <div className="w-full  p-8 bg-gray-100">
            <h2 className="text-center font-bold mt-[3rem]">お知らせ</h2>
            <div className="max-w-6xl mt-[2.5rem] mx-auto">
                <div className="max-w-6xl mt-[2.5rem]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Date</CardTitle>
                            <CardDescription> Description</CardDescription>
                        </CardHeader>
                        <CardHeader>
                            <CardTitle>Date</CardTitle>
                            <CardDescription> Description</CardDescription>
                        </CardHeader>
                        <CardHeader>
                            <CardTitle>Date</CardTitle>
                            <CardDescription> Description</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

            </div>
        </div >

    )
}