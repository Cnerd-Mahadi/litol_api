import { CreateMindMap } from "@/components/layout/mindmap/create";
import { MindMapGallery } from "@/components/layout/mindmap/list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default function MindMapPage() {
	return (
		<main className="py-8 h-screen">
			<Tabs defaultValue="create" className="h-full pl-4">
				<TabsList className="w-full max-w-sm flex mx-auto p-0 border border-blue-500 text-blue-600 bg-white">
					<TabsTrigger
						value="create"
						className="w-full py-3 bg-transparent rounded-r-none data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-none">
						Create
					</TabsTrigger>
					<TabsTrigger
						value="gallery"
						className="w-full py-3 bg-transparent rounded-l-none data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-none">
						Gallery
					</TabsTrigger>
				</TabsList>
				<TabsContent value="create" className="py-4">
					<ScrollArea className="h-screen">
						<CreateMindMap />
					</ScrollArea>
				</TabsContent>
				<TabsContent value="gallery" className="py-4">
					<ScrollArea className="h-screen">
						<MindMapGallery />
					</ScrollArea>
				</TabsContent>
			</Tabs>
		</main>
	);
}
