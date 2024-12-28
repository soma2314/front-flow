import express from "express";

export const dummyController = (req, res) => {
    console.log("dummyController is hit");
    res.json({ message: "Simple dummy controller for about team is hit" });
};