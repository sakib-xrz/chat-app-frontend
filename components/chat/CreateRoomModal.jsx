"use client";

import { useFormik } from "formik";
import { X } from "lucide-react";
import { useCreateRoomMutation } from "@/redux/features/chat/chatApi";
import { createRoomSchema } from "@/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CreateRoomModal({ onClose }) {
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: createRoomSchema,
    onSubmit: async (values) => {
      await createRoom(values);
      onClose();
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter room name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter room description"
                rows="3"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className={
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-xs">
                  {formik.errors.description}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
