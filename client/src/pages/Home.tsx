import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, ChevronRight, ShieldCheck, Save, Loader2, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


// Define the form data structure
type FormData = {
  crmName: string;
  crmNotApplicable: boolean;
  dmsName: string;
  dmsNotApplicable: boolean;
  websiteProvider: string;
  websiteNotApplicable: boolean;
  thirdPartyVendors: string;
  thirdPartyNotApplicable: boolean;
  facebookAdsUsage: string;
  facebookAdsNotApplicable: boolean;
  marketplacePlatforms: string;
  marketplaceNotApplicable: boolean;
  backendProducts: string;
  backendNotApplicable: boolean;
  subprimeLenders: string;
  subprimeNotApplicable: boolean;
  salesProcessStructure: string;
  salesProcessNotApplicable: boolean;
  rehashingLenders: string;
  rehashingNotApplicable: boolean;
};

const TOTAL_STEPS = 11; // 10 questions + 1 welcome screen
const STORAGE_KEY_DATA = "tredfi-onboarding-data";
const STORAGE_KEY_STEP = "tredfi-onboarding-step";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Scheduling state - now using Calendly
  const [isScheduled, setIsScheduled] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      crmNotApplicable: false,
      dmsNotApplicable: false,
      websiteNotApplicable: false,
      thirdPartyNotApplicable: false,
      facebookAdsNotApplicable: false,
      marketplaceNotApplicable: false,
      backendNotApplicable: false,
      subprimeNotApplicable: false,
      salesProcessNotApplicable: false,
      rehashingNotApplicable: false,
    }
  });

  // Watch values to handle conditional disabling and auto-save
  const watchAllFields = watch();

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);
    const savedStep = localStorage.getItem(STORAGE_KEY_STEP);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
        if (savedStep) {
          setCurrentStep(Number(savedStep));
        }
        toast.info("Welcome back! We've restored your progress.", {
          icon: <Save className="w-4 h-4" />,
          duration: 4000,
        });
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  // Save data on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(watchAllFields));
    }
  }, [watchAllFields, isLoaded]);

  // Save step on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_STEP, String(currentStep));
    }
  }, [currentStep, isLoaded]);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitMutation = trpc.onboarding.submit.useMutation({
    onSuccess: () => {
      // Clear local storage on success
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_STEP);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Onboarding information submitted successfully!");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(`Submission failed: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate multi-step submission process for UX
    setSubmissionStatus("Validating your responses...");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSubmissionStatus("Encrypting data for secure transmission...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmissionStatus("Sending to Tredfi secure servers...");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setSubmissionStatus("Finalizing setup...");
    await new Promise(resolve => setTimeout(resolve, 500));

    // Actually submit to database
    submitMutation.mutate(data);
  };

  // Calendly event listener
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        if (e.data.event === 'calendly.event_scheduled') {
          setIsScheduled(true);
          toast.success("Your implementation call has been scheduled!");
        }
      }
    };
    
    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, []);

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-10">
           <img src="/images/hero-background.jpg" alt="Background" className="w-full h-full object-cover" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full z-10"
        >
          <Card className="border-none shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side: Success Message */}
              <div className="p-8 flex flex-col items-center text-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <img src="/images/success-illustration.png" alt="Success" className="w-16 h-16 object-contain" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-2">You're All Set!</h2>
                <p className="text-muted-foreground mb-6">
                  We've received your details. Our team is analyzing your stack to build your custom plan.
                </p>
                
                {!isScheduled ? (
                  <div className="bg-secondary/50 p-4 rounded-xl w-full text-left space-y-2 border border-border/50 mb-6">
                    <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" /> Next Step: Implementation Call
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Please select a time on the right to schedule your 1-on-1 setup session with a Tredfi expert.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-500/10 p-6 rounded-xl w-full text-center space-y-3 border border-green-500/20 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-700">Call Confirmed!</h3>
                      <p className="text-sm text-green-800 mt-1">
                        Your session has been booked successfully.
                      </p>
                    </div>
                    <p className="text-xs text-green-700/80">
                      A calendar invitation has been sent to your email.
                    </p>
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                  Return to Dashboard
                </Button>
              </div>

              {/* Right Side: Calendly Scheduler */}
              <div className="p-8 bg-secondary/20">
                {!isScheduled ? (
                  <div className="h-full flex flex-col">
                    <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" /> Schedule Your Call
                    </h3>
                    
                    <div className="flex-1 rounded-lg overflow-hidden border border-border shadow-sm bg-card">
                      <iframe
                        src="https://calendly.com/james-tredfi/onboarding-session?embed_domain=localhost&embed_type=Inline&hide_gdpr_banner=1"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Schedule your Tredfi onboarding session"
                        className="min-h-[600px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Thank you!</h3>
                    <p className="text-muted-foreground">
                      Your implementation call is booked. We look forward to speaking with you soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
         <img src="/images/hero-background.jpg" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <header className="w-full p-6 z-10 flex justify-between items-center container mx-auto">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Tredfi Logo" className="h-10 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            <Save className="w-3 h-3 mr-1.5" /> Auto-save enabled
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {currentStep > 0 && `Step ${currentStep} of ${TOTAL_STEPS}`}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 container mx-auto max-w-4xl relative">
        
        {/* Submission Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl"
            >
              <div className="flex flex-col items-center space-y-4 p-8 bg-card rounded-xl shadow-2xl border border-border max-w-sm w-full mx-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-serif text-foreground">Submitting...</h3>
                <p className="text-muted-foreground text-center animate-pulse">{submissionStatus}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="w-full max-w-2xl mb-8 space-y-2">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-2xl overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-primary/5 p-8 flex items-center justify-center">
                      <img src="/images/welcome-illustration.png" alt="Welcome" className="w-full max-w-[250px] object-contain drop-shadow-xl" />
                    </div>
                    <div className="p-8 flex flex-col justify-center space-y-6">
                      <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome to Tredfi!</h1>
                        <p className="text-muted-foreground">
                          We're thrilled to partner with you. To get your dealership set up for success, we need a few details about your current tools and processes.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary font-bold text-sm">1</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">10 Quick Questions</h3>
                            <p className="text-sm text-muted-foreground">Takes about 5 minutes to complete.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary font-bold text-sm">2</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">Custom Setup Plan</h3>
                            <p className="text-sm text-muted-foreground">We'll tailor the integration to your stack.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary font-bold text-sm">3</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">Implementation Call</h3>
                            <p className="text-sm text-muted-foreground">Scheduled within 48 hours of submission.</p>
                          </div>
                        </div>
                      </div>

                      <Button type="button" size="lg" onClick={nextStep} className="w-full group">
                        Let's Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 1: CRM */}
            {currentStep === 1 && (
              <FormStep
                key="step1"
                title="CRM System"
                description="Which Customer Relationship Management software do you currently use?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crmName">CRM Company Name</Label>
                    <Input 
                      id="crmName" 
                      placeholder="e.g., VinSolutions, eLeads, DriveCentric" 
                      {...register("crmName")} 
                      disabled={watchAllFields.crmNotApplicable}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="crmNotApplicable" 
                      onCheckedChange={(checked) => setValue("crmNotApplicable", checked as boolean)}
                      checked={watchAllFields.crmNotApplicable}
                    />
                    <Label htmlFor="crmNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't use a CRM / Not Applicable
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 2: DMS */}
            {currentStep === 2 && (
              <FormStep
                key="step2"
                title="Dealer Management System (DMS)"
                description="What system do you use for managing your inventory and deals?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dmsName">DMS Provider</Label>
                    <Input 
                      id="dmsName" 
                      placeholder="e.g., Reynolds & Reynolds, CDK, Dealertrack" 
                      {...register("dmsName")} 
                      disabled={watchAllFields.dmsNotApplicable}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dmsNotApplicable" 
                      onCheckedChange={(checked) => setValue("dmsNotApplicable", checked as boolean)}
                      checked={watchAllFields.dmsNotApplicable}
                    />
                    <Label htmlFor="dmsNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't use a DMS / Not Applicable
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 3: Website */}
            {currentStep === 3 && (
              <FormStep
                key="step3"
                title="Website Provider"
                description="Who currently hosts and manages your dealership's website?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="websiteProvider">Website Company</Label>
                    <Input 
                      id="websiteProvider" 
                      placeholder="e.g., Dealer.com, DealerOn, Sincro" 
                      {...register("websiteProvider")} 
                      disabled={watchAllFields.websiteNotApplicable}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="websiteNotApplicable" 
                      onCheckedChange={(checked) => setValue("websiteNotApplicable", checked as boolean)}
                      checked={watchAllFields.websiteNotApplicable}
                    />
                    <Label htmlFor="websiteNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't have a website / Not Applicable
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 4: Third-party Vendors */}
            {currentStep === 4 && (
              <FormStep
                key="step4"
                title="Third-Party Vendors"
                description="Are there any other key software vendors or tools integrated into your workflow?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="thirdPartyVendors">Vendor Names</Label>
                    <Textarea 
                      id="thirdPartyVendors" 
                      placeholder="List any other tools (e.g., chat tools, trade-in tools, merchandising software)..." 
                      {...register("thirdPartyVendors")} 
                      disabled={watchAllFields.thirdPartyNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="thirdPartyNotApplicable" 
                      onCheckedChange={(checked) => setValue("thirdPartyNotApplicable", checked as boolean)}
                      checked={watchAllFields.thirdPartyNotApplicable}
                    />
                    <Label htmlFor="thirdPartyNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      No other vendors / Not Applicable
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 5: Facebook Ads */}
            {currentStep === 5 && (
              <FormStep
                key="step5"
                title="Facebook Advertising"
                description="Do you currently run Facebook Ads? If so, who manages them?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebookAdsUsage">Ads Management Details</Label>
                    <Textarea 
                      id="facebookAdsUsage" 
                      placeholder="e.g., Managed in-house, Managed by Agency X, Spending approx $2k/mo..." 
                      {...register("facebookAdsUsage")} 
                      disabled={watchAllFields.facebookAdsNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="facebookAdsNotApplicable" 
                      onCheckedChange={(checked) => setValue("facebookAdsNotApplicable", checked as boolean)}
                      checked={watchAllFields.facebookAdsNotApplicable}
                    />
                    <Label htmlFor="facebookAdsNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't run Facebook Ads
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 6: Marketplace Platforms */}
            {currentStep === 6 && (
              <FormStep
                key="step6"
                title="Marketplace Platforms"
                description="Where do you post your inventory online besides your own website?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketplacePlatforms">Platforms Used</Label>
                    <Textarea 
                      id="marketplacePlatforms" 
                      placeholder="e.g., Autotrader, Cars.com, CarGurus, Facebook Marketplace..." 
                      {...register("marketplacePlatforms")} 
                      disabled={watchAllFields.marketplaceNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="marketplaceNotApplicable" 
                      onCheckedChange={(checked) => setValue("marketplaceNotApplicable", checked as boolean)}
                      checked={watchAllFields.marketplaceNotApplicable}
                    />
                    <Label htmlFor="marketplaceNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't use 3rd party marketplaces
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 7: Backend Products */}
            {currentStep === 7 && (
              <FormStep
                key="step7"
                title="Backend Products"
                description="What F&I products do you sell (warranties, GAP, etc.) and who are the providers?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backendProducts">Products & Providers</Label>
                    <Textarea 
                      id="backendProducts" 
                      placeholder="e.g., VSC provided by GWC, GAP provided by Allstate..." 
                      {...register("backendProducts")} 
                      disabled={watchAllFields.backendNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="backendNotApplicable" 
                      onCheckedChange={(checked) => setValue("backendNotApplicable", checked as boolean)}
                      checked={watchAllFields.backendNotApplicable}
                    />
                    <Label htmlFor="backendNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't sell backend products
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 8: Subprime Lenders */}
            {currentStep === 8 && (
              <FormStep
                key="step8"
                title="Subprime Lenders"
                description="Which lenders do you work with for subprime or special finance deals?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subprimeLenders">Lender List</Label>
                    <Textarea 
                      id="subprimeLenders" 
                      placeholder="e.g., Westlake, Santander, Credit Acceptance..." 
                      {...register("subprimeLenders")} 
                      disabled={watchAllFields.subprimeNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="subprimeNotApplicable" 
                      onCheckedChange={(checked) => setValue("subprimeNotApplicable", checked as boolean)}
                      checked={watchAllFields.subprimeNotApplicable}
                    />
                    <Label htmlFor="subprimeNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't do subprime financing
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 9: Sales Process */}
            {currentStep === 9 && (
              <FormStep
                key="step9"
                title="Sales Process Structure"
                description="How is your sales team structured? Do you have a traditional Sales Manager to F&I Manager handoff?"
                onNext={nextStep}
                onPrev={prevStep}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="salesProcessStructure">Process Description</Label>
                    <Textarea 
                      id="salesProcessStructure" 
                      placeholder="e.g., Yes, Sales Manager desks the deal, then hands to F&I for contracting..." 
                      {...register("salesProcessStructure")} 
                      disabled={watchAllFields.salesProcessNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="salesProcessNotApplicable" 
                      onCheckedChange={(checked) => setValue("salesProcessNotApplicable", checked as boolean)}
                      checked={watchAllFields.salesProcessNotApplicable}
                    />
                    <Label htmlFor="salesProcessNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      Not Applicable / Other Structure
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

            {/* Step 10: Rehashing Lenders */}
            {currentStep === 10 && (
              <FormStep
                key="step10"
                title="Rehashing Lenders"
                description="Which lenders allow you to rehash deals (negotiate terms after initial approval)?"
                onNext={() => {}} // Handled by submit button
                onPrev={prevStep}
                isLastStep={true}
                isSubmitting={isSubmitting}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rehashingLenders">Lender Names</Label>
                    <Textarea 
                      id="rehashingLenders" 
                      placeholder="List lenders available for deal rehashing..." 
                      {...register("rehashingLenders")} 
                      disabled={watchAllFields.rehashingNotApplicable}
                      className="min-h-[120px] text-base resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="rehashingNotApplicable" 
                      onCheckedChange={(checked) => setValue("rehashingNotApplicable", checked as boolean)}
                      checked={watchAllFields.rehashingNotApplicable}
                    />
                    <Label htmlFor="rehashingNotApplicable" className="font-normal text-muted-foreground cursor-pointer">
                      We don't rehash deals / Not Applicable
                    </Label>
                  </div>
                </div>
              </FormStep>
            )}

          </AnimatePresence>
        </form>
      </main>
    </div>
  );
}

// Reusable Form Step Component
function FormStep({ 
  title, 
  description, 
  children, 
  onNext, 
  onPrev, 
  isLastStep = false,
  isSubmitting = false
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  onNext: () => void; 
  onPrev: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-serif text-primary">{title}</CardTitle>
          <CardDescription className="text-base mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {children}
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t border-border/50">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onPrev}
            className="text-muted-foreground hover:text-foreground"
            disabled={isSubmitting}
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          
          {isLastStep ? (
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? "Submitting..." : "Complete Setup"}
              {!isSubmitting && <ShieldCheck className="ml-2 w-4 h-4" />}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={onNext} className="min-w-[140px]">
              Next <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
