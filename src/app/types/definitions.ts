// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type Question = {
    uuid: string;
    creator: string;
    title: string;
    content: string;
    dateCreated: string;
    dateUpdated: string;
    tags: string[];
}

export type Answer = {
    uuid: string;
    creator: string;
    source: string;
    time_elapsed: string;

    question: string;
    title: string;
    content: string;

    dateCreated: string;
    dateUpdated: string;
}
