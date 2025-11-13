"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils"

export function AnimatedListItem({
  children
}) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full max-w-[260px] text-sm sm:text-base">
      {children}
    </motion.div>
  );
}

export const AnimatedList = React.memo(({
  children,
  className,
  delay = 1800,
  max = 5,
  ...props
}) => {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
  const [pointer, setPointer] = useState(0);
  const [items, setItems] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (childrenArray.length === 0) return;

    const tick = () => {
      const current = childrenArray[pointer];
      idRef.current += 1;
      setItems(prev => [{ node: current, uid: idRef.current }, ...prev].slice(0, max));
      setPointer((pointer + 1) % childrenArray.length);
    };

    const timeout = setTimeout(tick, delay);
    return () => clearTimeout(timeout);
  }, [pointer, delay, childrenArray, max]);

  return (
    <div className={cn(`flex flex-col items-center gap-2`, className)} {...props}>
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <AnimatedListItem key={item.uid}>
            {item.node}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
})

AnimatedList.displayName = "AnimatedList"

function NotificationCard({ name, description, icon, color, time }) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl py-1 px-2",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white/10 backdrop-blur-md border border-white/20",
        "[box-shadow:0_0_0_1px_rgba(255,255,255,.1),0_2px_4px_rgba(0,0,0,.1),0_12px_24px_rgba(0,0,0,.1)]",
        "transform-gpu"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-white/60">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-white/80">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function NotificationsList({ className }) {
  let notifications = [
    { 
      name: "Food", 
      description: "McDonald's 🍔", 
      time: "12m ago", 
      icon: "🍔", 
      color: "#FF8A65" 
    },
    { 
      name: "Shopping", 
      description: "New expense detected at Zara 🛍️", 
      time: "8m ago", 
      icon: "🛒", 
      color: "#9575CD" 
    },
    { 
      name: "Entertainment", 
      description: "Netflix subscription renewed 🎬", 
      time: "5m ago", 
      icon: "🎮", 
      color: "#F06292" 
    },
    { 
      name: "Health", 
      description: "Pharmacy purchase 💊", 
      time: "3m ago", 
      icon: "💊", 
      color: "#4DB6AC" 
    },
    { 
      name: "Travel", 
      description: "Uber ride added to your trips 🚗", 
      time: "1m ago", 
      icon: "✈️", 
      color: "#64B5F6" 
    },
  ];

  return (
    <AnimatedList className={className}>
      {notifications.map((item, idx) => (
        <NotificationCard key={idx} {...item} />
      ))}
    </AnimatedList>
  );
}
