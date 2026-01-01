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
import { ArrowRight, Check, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
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

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
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

  // Watch values to handle conditional disabling
  const watchAllFields = watch();

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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Onboarding information submitted successfully!");
  };

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
          className="max-w-md w-full z-10"
        >
          <Card className="border-none shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <img src="/images/success-illustration.png" alt="Success" className="w-20 h-20 object-contain" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary">You're All Set!</h2>
              <p className="text-muted-foreground text-lg">
                Thank you for providing your dealership details. Our team is already reviewing your information to build your custom setup plan.
              </p>
              <div className="bg-secondary/50 p-6 rounded-xl w-full text-left space-y-3 border border-border/50">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" /> What happens next?
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground pl-7 list-disc">
                  <li>We will analyze your current tech stack.</li>
                  <li>A custom integration plan will be created.</li>
                  <li>Expect an implementation call invite within <strong>48 hours</strong>.</li>
                </ul>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={() => window.location.reload()}>
                Return to Dashboard
              </Button>
            </CardContent>
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
        <div className="text-sm text-muted-foreground font-medium">
          {currentStep > 0 && `Step ${currentStep} of ${TOTAL_STEPS}`}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 container mx-auto max-w-4xl">
        
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
