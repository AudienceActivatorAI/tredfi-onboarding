import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const { data: submissions, isLoading, refetch } = trpc.onboarding.list.useQuery(undefined, {
    enabled: !!user && user.role === 'admin',
  });

  const updateStatusMutation = trpc.onboarding.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-500"><AlertCircle className="w-3 h-3 mr-1" />New</Badge>;
      case "in_progress":
        return <Badge variant="default" className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Onboarding Submissions</h1>
            <p className="text-muted-foreground mt-1">Manage and review dealership onboarding responses</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>
            Back to Form
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{submissions?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New</CardDescription>
              <CardTitle className="text-3xl">
                {submissions?.filter(s => s.status === "new").length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">
                {submissions?.filter(s => s.status === "completed").length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>Click on a row to view full details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Dealership</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">#{submission.id}</TableCell>
                        <TableCell>{submission.dealershipName || "N/A"}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{submission.contactEmail || "N/A"}</div>
                            <div className="text-muted-foreground">{submission.contactPhone || ""}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Submission Details - #{submission.id}</DialogTitle>
                                  <DialogDescription>
                                    Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-4">
                                  {/* Contact Info */}
                                  <div>
                                    <h3 className="font-semibold mb-2">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div><span className="text-muted-foreground">Dealership:</span> {submission.dealershipName || "N/A"}</div>
                                      <div><span className="text-muted-foreground">Email:</span> {submission.contactEmail || "N/A"}</div>
                                      <div><span className="text-muted-foreground">Phone:</span> {submission.contactPhone || "N/A"}</div>
                                    </div>
                                  </div>

                                  {/* Form Responses */}
                                  <div>
                                    <h3 className="font-semibold mb-2">Form Responses</h3>
                                    <div className="space-y-3 text-sm">
                                      <div>
                                        <span className="font-medium">CRM:</span> {submission.crmNotApplicable ? "Not Applicable" : submission.crmName || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">DMS:</span> {submission.dmsNotApplicable ? "Not Applicable" : submission.dmsName || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Website Provider:</span> {submission.websiteNotApplicable ? "Not Applicable" : submission.websiteProvider || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Third-Party Vendors:</span> {submission.thirdPartyNotApplicable ? "Not Applicable" : submission.thirdPartyVendors || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Facebook Ads:</span> {submission.facebookAdsNotApplicable ? "Not Applicable" : submission.facebookAdsUsage || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Marketplace Platforms:</span> {submission.marketplaceNotApplicable ? "Not Applicable" : submission.marketplacePlatforms || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Backend Products:</span> {submission.backendNotApplicable ? "Not Applicable" : submission.backendProducts || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Subprime Lenders:</span> {submission.subprimeNotApplicable ? "Not Applicable" : submission.subprimeLenders || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Sales Process:</span> {submission.salesProcessNotApplicable ? "Not Applicable" : submission.salesProcessStructure || "N/A"}
                                      </div>
                                      <div>
                                        <span className="font-medium">Rehashing Lenders:</span> {submission.rehashingNotApplicable ? "Not Applicable" : submission.rehashingLenders || "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status Update */}
                                  <div>
                                    <h3 className="font-semibold mb-2">Update Status</h3>
                                    <Select
                                      value={submission.status}
                                      onValueChange={(value) => {
                                        updateStatusMutation.mutate({
                                          id: submission.id,
                                          status: value as "new" | "in_progress" | "completed",
                                        });
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Select
                              value={submission.status}
                              onValueChange={(value) => {
                                updateStatusMutation.mutate({
                                  id: submission.id,
                                  status: value as "new" | "in_progress" | "completed",
                                });
                              }}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No submissions yet. They will appear here once dealerships complete the onboarding form.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
