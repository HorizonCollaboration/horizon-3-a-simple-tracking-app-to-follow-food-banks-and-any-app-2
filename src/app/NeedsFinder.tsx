"use client";

import { Flame, PackageCheck, Store, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ListButton from "@/components/ListButton";
import { categoryLook } from "@/components/looks";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import { Button, EmptyState, List, Row, Section, Segmented, Select, Stat, Tile } from "@/kit";
import { categories } from "@/lib/needs";

export type NeedRow = {
  id: string;
  item: string;
  category: string;
  level: string;
  note: string | null;
  foodBankId: string;
  foodBankName: string;
  /** "today", "yesterday" or "3 days ago" */
  updated: string;
};

type Props = {
  needs: NeedRow[];
  followedIds: string[];
  plannedIds: string[];
  signedIn: boolean;
};

const scopes = [
  { value: "following", label: "Food banks I follow" },
  { value: "all", label: "All food banks" },
];

const types = [{ value: "all", label: "All types" }, ...categories.map((category) => ({ value: category, label: category }))];

/** The combined list of needs, with a choice of food banks and type of item. */
export default function NeedsFinder({ needs, followedIds, plannedIds, signedIn }: Props) {
  const [chosenScope, setScope] = useState("following");
  const [type, setType] = useState("all");

  // Following needs sign-in, so signed-out visitors always see everything.
  const scope = signedIn ? chosenScope : "all";
  const inScope = needs.filter((need) => scope === "all" || followedIds.includes(need.foodBankId));
  const shown = inScope.filter((need) => type === "all" || need.category === type);
  const urgentCount = inScope.filter((need) => need.level === "urgent").length;
  const bankCount = new Set(inScope.map((need) => need.foodBankId)).size;
  const noneFollowed = scope === "following" && followedIds.length === 0;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Urgent" value={urgentCount} icon={Flame} tone="red" />
        <Stat label="Running low" value={inScope.length - urgentCount} icon={TrendingDown} tone="amber" />
        <Stat label="Food banks" value={bankCount} icon={Store} tone="indigo" />
      </div>

      <Section
        title={`Short right now · ${shown.length} ${shown.length === 1 ? "item" : "items"}`}
        action={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            {signedIn && <Segmented ariaLabel="Food banks" value={scope} onChange={setScope} options={scopes} />}
            <Select ariaLabel="Type of item" value={type} onChange={setType} options={types} />
          </div>
        }
      >
        {!signedIn && (
          <p className="text-sm text-muted-foreground">
            Showing all food banks.{" "}
            <Link href="/sign-in" className="font-medium text-primary underline underline-offset-2">
              Sign in
            </Link>{" "}
            to follow the ones near you and see just theirs.
          </p>
        )}

        {noneFollowed ? (
          <EmptyState
            icon={Store}
            title="You're not following any food banks yet"
            description="Follow the ones near you to see what they need here."
            action={
              <Button variant="primary" href="/food-banks">
                Choose food banks to follow
              </Button>
            }
          />
        ) : shown.length === 0 && type !== "all" ? (
          <EmptyState
            icon={PackageCheck}
            title="Nothing of this type is short"
            description="Try another type, or see everything that's needed."
            action={<Button onClick={() => setType("all")}>Show all types</Button>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="Nothing is short right now"
            description="Check back soon."
            action={scope === "following" && <Button onClick={() => setScope("all")}>Show all food banks</Button>}
          />
        ) : (
          <List>
            {shown.map((need) => {
              const look = categoryLook(need.category);

              return (
                <Row
                  key={need.id}
                  media={<Tile icon={look.icon} tone={look.tone} />}
                  title={need.item}
                  description={
                    <span>
                      <Link href={`/food-banks/${need.foodBankId}`} className="relative z-10 font-medium text-foreground hover:text-primary hover:underline">
                        {need.foodBankName}
                      </Link>{" "}
                      · {need.category} · Updated {need.updated}
                    </span>
                  }
                  actions={<ListButton needId={need.id} item={need.item} planned={plannedIds.includes(need.id)} signedIn={signedIn} />}
                >
                  <NeedBadge kind={levelBadge(need.level)} />
                  {need.note && <span className="text-sm text-muted-foreground">{need.note}</span>}
                </Row>
              );
            })}
          </List>
        )}
      </Section>
    </>
  );
}
