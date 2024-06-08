import { cn } from "@/lib/utils";
import React from "react";

interface CenterContainerProp extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CenterContainer = ({
  children,
  className,
  ...props
}: CenterContainerProp) => {
  return (
    <div
      className={cn("flex items-center flex-col justify-center", className)}
      {...props}
    >
      <div className="w-full sm:w-[606px] my-1">{children}</div>
    </div>
  );
};

export default CenterContainer;
