import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {useZipcodeStore} from "@/lib/zustand";
import { Button } from "@/components/ui/button";
import InteractiveBarChart from "@/components/interactive-bar-chart";
import React from "react";

const ZipcodeDrawer = () => {
  const isDrawerOpen = useZipcodeStore((state:any) => state.isDrawerOpen);
  const setIsDrawerOpen = useZipcodeStore((state:any) => state.setIsDrawerOpen);
  const zipcode = useZipcodeStore((state:any) => state.zipcode);

  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isDrawerOpen) {
    const fetchData = async () => {
      const response = await fetch(`/api/incomeData/${zipcode}`);
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }
  }, [isDrawerOpen]);
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Zipcode Information</DrawerTitle>
          <DrawerDescription>
            Details for zipcode: {zipcode || "—"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerContent>
          <InteractiveBarChart data={data} />
        </DrawerContent>
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