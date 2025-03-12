import { useAuth, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';


const useClerkSysncMongoose = () => {

    const { user , isSignedIn} = useUser();


    useEffect(() => {
        if(user && isSignedIn){
            console.log(user);
        }
    },[user , isSignedIn]);
}

export default useClerkSysncMongoose;
