import { Suspense } from 'react'
import VerifyEmail from './VerifyEmail'

export default function page(){
    return(
        <Suspense fallback={<div>Loading....</div>}>
            <VerifyEmail />
        </Suspense>
    )
}