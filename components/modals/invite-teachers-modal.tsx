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
import { inviteTeachersModalState } from "@/states/invite-teachers-modal";

const formSchema = z.object({
  email: z.string().email(),
});

export default function InviteTeachersModal() {
  const modal = inviteTeachersModalState();
  const [loading, setLoading] = React.useState(false);

  const path = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch("/api/school/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          schoolId: path.split("/")[2],
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
    <AlertDialog
      open={modal.isOpen}
      onOpenChange={() => {
        form.reset();
        modal.onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className="flex justify-between items-center flex-row">
          <AlertDialogTitle>Invite Teacher</AlertDialogTitle>
          <AlertDialogCancel
            disabled={loading}
            className="border-none p-1 rounded-full"
          >
            <X />
          </AlertDialogCancel>
        </AlertDialogHeader>
        <AlertDialogDescription className="!text-left">
          <ScrollArea className=" scroll-smooth">
            <ScrollBar />
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Teachers
              </h4>
              <ul className="space-y-2">
                {modal.teachers.map((teacher) => (
                  <li key={teacher}>{teacher}</li>
                ))}
                {modal.teachers.length == 0 && (
                  <li className="text-gray-500">No teachers</li>
                )}
              </ul>
            </div>
          </ScrollArea>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  disabled={loading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Teacher Email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Invite"}
                </Button>
              </form>
            </Form>
          </div>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
