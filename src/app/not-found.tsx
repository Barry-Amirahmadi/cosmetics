import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <Section>
      <div className="grid-editorial">
        <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-6">
          <Eyebrow>صفحه پیدا نشد</Eyebrow>
          <h1 className="t-h1">این نشانی وجود ندارد</h1>
          <p className="t-lead">
            ممکن است نشانی تغییر کرده باشد. از صفحهٔ اصلی می‌توانید مجموعه و گالری را ببینید.
          </p>
          <div>
            <Button href="/">بازگشت به صفحهٔ اصلی</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
