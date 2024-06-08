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
import { useRouter } from "next/navigation";

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
import { registerSchoolModalState } from "@/states/register-school-modal";
import { X } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "School name must be at least 3 characters long",
  }),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export default function RegisterSchoolModal() {
  const modal = registerSchoolModalState();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const query = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch("/api/school/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.status != 200) throw new Error(data.message);

      toast.success(data.message);
      await query.fetchQuery({
        queryKey: ["schools"],
      });
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
          modal.onClose();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader className="flex justify-between items-center flex-row">
            <AlertDialogTitle>Register School</AlertDialogTitle>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="School Name"
                            autoComplete="school name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="School Description" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="School Email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="School Phone"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          We will use this to email and phone number to contact
                          you and verify your school.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Register School"}
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
