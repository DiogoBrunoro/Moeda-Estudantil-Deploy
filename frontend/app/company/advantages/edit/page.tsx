'use client'

import {Suspense} from "react"
import EditAdvantagePage from "@/components/edit-advantage"

export default function Page(){
    return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EditAdvantagePage />
    </Suspense>
  );
}