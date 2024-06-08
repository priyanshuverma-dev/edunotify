"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "../ui/textarea";
import { createNoticeModalState } from "@/states/create-notice-modal";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "School name must be at least 3 characters long",
  }),
  content: z.string().min(10, {
    message: "School name must be at least 10 characters long",
  }),
});

export default function CreateNoticeModal() {
  const modal = createNoticeModalState();
  const [loading, setLoading] = React.useState(false);

  const pathName = usePathname();

  const query = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch("/api/notice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          schoolId: pathName.split("/")[2],
        }),
      });

      const data = await res.json();
      if (res.status != 200) throw new Error(data.message);

      toast.success(data.message);

      modal.onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollArea className="py-2 px-4 h-full overflow-y-auto scroll-smooth">
      <AlertDialog
        open={modal.isOpen}
        onOpenChange={() => {
          form.reset();
          modal.onClose();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader className="flex justify-between items-center flex-row">
            <AlertDialogTitle>Create Notice</AlertDialogTitle>
            <AlertDialogCancel
              disabled={loading}
              className="border-none p-1 rounded-full"
            >
              <X />
            </AlertDialogCancel>
          </AlertDialogHeader>
          <AlertDialogDescription className="!text-left">
            <ScrollBar />
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Notice Title" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Notice Content" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Create"}
                  </Button>
                </form>
              </Form>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
}
