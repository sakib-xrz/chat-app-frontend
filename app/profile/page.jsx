"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useGetProfileQuery,
  useChangePasswordMutation,
} from "@/redux/features/auth/authApi";
import { changePasswordSchema } from "@/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: user } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }).unwrap();

        setSuccessMessage("Password changed successfully");
        setErrorMessage("");
        resetForm();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
        setErrorMessage(err.data?.message || "Failed to change password");
        setSuccessMessage("");
      }
    },
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/chat"
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Chat
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <h2 className="text-md font-medium text-gray-900 mb-2">
                Account Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h2 className="text-md font-medium text-gray-900 mb-4">
                Change Password
              </h2>

              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.currentPassword}
                    className={
                      formik.touched.currentPassword &&
                      formik.errors.currentPassword
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.currentPassword &&
                    formik.errors.currentPassword && (
                      <p className="text-red-500 text-xs">
                        {formik.errors.currentPassword}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    className={
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmNewPassword}
                    className={
                      formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.confirmNewPassword &&
                    formik.errors.confirmNewPassword && (
                      <p className="text-red-500 text-xs">
                        {formik.errors.confirmNewPassword}
                      </p>
                    )}
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Change Password"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
