import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {useZipcodeStore} from "@/lib/zustand";
import { Button } from "@/components/ui/button";

const ZipcodeDrawer = () => {
  const isDrawerOpen = useZipcodeStore((state:any) => state.isDrawerOpen);
  const setIsDrawerOpen = useZipcodeStore((state:any) => state.setIsDrawerOpen);
  const zipcode = useZipcodeStore((state:any) => state.zipcode);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Zipcode Information</DrawerTitle>
          <DrawerDescription>
            Details for zipcode: {zipcode || "—"}
          </DrawerDescription>
        </DrawerHeader>
        {/* <div className="p-4">
          {insights ? (
            <p className="text-sm text-gray-600">{insights}</p>
          ) : (
            <p className="text-sm text-gray-400">No insights available for this zipcode.</p>
          )}
        </div> */}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ZipcodeDrawer; 