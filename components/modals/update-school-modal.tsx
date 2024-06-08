"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import toast from "react-hot-toast";
import useSchool from "@/hooks/use-school";
import { updateSchoolModalState } from "@/states/update-school-modal";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "School name must be at least 3 characters long",
  }),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export default function UpdateSchoolModal() {
  const modal = updateSchoolModalState();

  const pathName = usePathname();

  const [loading, setLoading] = React.useState(false);
  const {
    data: school,
    isLoading,
    error,
  } = useSchool({
    schoolId: pathName.split("/")[2],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: school?.name ?? "",
      phone: school?.phone ?? "",
      email: school?.email ?? "",
      description: school?.description ?? "",
    },
  });

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        phone: school.phone,
        email: school.email,
        description: school.description,
      });
    }
  }, [school]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch("/api/school/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          schoolId: school?.id,
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
            <AlertDialogTitle>Update School</AlertDialogTitle>
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
                            {...field}
                            placeholder="School Name"
                            autoComplete="school name"
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
                    {loading ? "Loading..." : "Save"}
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
