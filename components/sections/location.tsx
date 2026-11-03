"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Icon, UiIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/pill-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { DAY_NAMES, formatHours, getStoreStatus, sortByWeek, type StoreStatus } from "@/lib/opening-hours";
import { directionsUrl, fullAddress, mapEmbedUrl, whatsappUrl } from "@/lib/store-links";
import type { HomePage, OpeningHours, Settings } from "@/lib/types";

const STATUS_REFRESH_MS = 60_000;
const COPY_RESET_MS = 2_500;

function useStoreStatus(hours: OpeningHours[]) {
  const [status, setStatus] = useState<StoreStatus | null | undefined>(undefined);

  useEffect(() => {
    const update = () => setStatus(getStoreStatus(hours, new Date()));
    const first = setTimeout(update, 0);
    const timer = setInterval(update, STATUS_REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [hours]);

  return status;
}

function CopyAddress({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), COPY_RESET_MS);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const label = { idle: "Salin alamat", copied: "Alamat tersalin", failed: "Gagal menyalin" }[state];

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-pine underline-offset-4 hover:underline active:opacity-70"
    >
      <UiIcon name={state === "copied" ? "check" : "copy"} className="size-4" strokeWidth={2} />
      {label}
    </button>
  );
}

function Hours({ settings }: { settings: Settings }) {
  const { openingHours, hoursNote, mapsUrl } = settings;
  const status = useStoreStatus(openingHours);

  if (openingHours.length === 0) {
    return (
      <p className="mt-1 leading-relaxed text-slate">
        Jam buka bisa dilihat di{" "}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="-my-3 inline-block py-3 font-semibold text-pine underline underline-offset-4"
        >
          Google Maps
        </a>
        .
      </p>
    );
  }

  return (
    <>
      <p className="mt-1 flex items-center gap-2 font-semibold" role="status">
        {status && <span aria-hidden="true" className={`size-2.5 rounded-full ${status.isOpen ? "bg-leaf" : "bg-slate"}`} />}
        {status === undefined ? "Memeriksa status toko..." : status?.label}
      </p>
      <details className="group mt-2">
        <summary className="inline-flex min-h-11 items-center text-sm font-semibold text-pine underline-offset-4 hover:underline">
          Lihat jam buka mingguan
        </summary>
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-slate">
          {sortByWeek(openingHours).map((entry) => (
            <div key={entry.day} className="contents">
              <dt>{DAY_NAMES[entry.day]}</dt>
              <dd>{formatHours(entry)}</dd>
            </div>
          ))}
        </dl>
      </details>
      {hoursNote && <p className="mt-2 text-sm text-slate">{hoursNote}</p>}
    </>
  );
}

function Map({ settings }: { settings: Settings }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[3rem] bg-mint lg:aspect-auto lg:h-full lg:min-h-[30rem] lg:rounded-[5rem]">
      {!loaded && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-slate">Memuat peta...</p>
      )}
      <iframe
        src={mapEmbedUrl(settings)}
        title={`Peta lokasi ${settings.storeName}`}
        width="800"
        height="600"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

function InfoRow({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint text-pine">{icon}</span>
      <div className="min-w-0">
        <h3 className="font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function Location({ copy, settings }: { copy: HomePage["location"]; settings: Settings }) {
  const { phone, whatsapp, email, addressNote } = settings;
  const address = fullAddress(settings);
  const hasContact = Boolean(phone || whatsapp || email);

  return (
    <section id="lokasi" className="pb-20 pt-4">
      <div className="wrap">
        <SectionHeading heading={copy.heading} subheading={copy.subheading} />
      </div>

      <div className="wrap-wide mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
        <Reveal effect="left" className="align-wrap">
          <div className="flex flex-col gap-7">
          <InfoRow title="Alamat" icon={<Icon name="pin" />}>
            <p className="mt-1 leading-relaxed text-slate">{address}</p>
            {addressNote && <p className="mt-1 text-sm leading-relaxed text-slate">{addressNote}</p>}
            <CopyAddress address={address} />
          </InfoRow>

          <InfoRow title="Jam Buka" icon={<Icon name="clock" />}>
            <Hours settings={settings} />
          </InfoRow>

          {hasContact && (
            <InfoRow title="Kontak" icon={<UiIcon name="phone" />}>
              <ul className="mt-1">
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-pine underline underline-offset-4">
                      {phone}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a href={whatsappUrl(whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-pine underline underline-offset-4">
                      <UiIcon name="whatsapp" className="size-5" />
                      Chat WhatsApp
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-pine underline underline-offset-4">
                      <UiIcon name="mail" className="size-5" />
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </InfoRow>
          )}

          <PillLink href={directionsUrl(settings)} className="self-start">
            Buka Rute
          </PillLink>
          </div>
        </Reveal>

        <Reveal effect="right">
          <Map settings={settings} />
        </Reveal>
      </div>
    </section>
  );
}
