import { toGreeklish } from "greek-utils"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MarkerCard({ item }) {
  return (
    <Card className="max-w-[12em] justify-center text-center">
      <CardHeader className="p-2 pb-0 font-serif">
        <CardTitle>
          <Badge className="rounded-full">{item.language}</Badge>
        </CardTitle>
        <CardDescription className="font-semibold text-current">
          {item.word}
          {item.language === "Ancient Greek"
            ? " (" + toGreeklish(item.word) + ")"
            : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 text-[.6rem] text-muted-foreground">
        <p>{item.definitions}</p>
      </CardContent>
    </Card>
  )
}
export function MarkerCard2({ item }) {
  return (
    <div
      className="mx-auto "
      style={{
        backgroundColor: "azure",
        padding: "6px 6px",
        width: 130,
        borderRadius: 4,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.24)",
        textAlign: "center",
        lineHeight: "0.8rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "2px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: "Cormorant Infant, serif",
            padding: "4px 10px",
            backgroundColor: "#5794c6",
            color: "white",
            borderRadius: "10px ",
          }}
        >
          {item.language}
        </div>
      </div>
      <div
        style={{
          fontSize: 16,
          fontFamily: "Cormorant Infant, serif",
          padding: "9px 0px",
          fontWeight: "bold",
        }}
      >
        {item.word}
        {item.language === "Ancient Greek"
          ? " (" + toGreeklish(item.word) + ")"
          : null}
      </div>
      <div
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 11,
        }}
      >
        {item.definitions}
      </div>
    </div>
  )
}
