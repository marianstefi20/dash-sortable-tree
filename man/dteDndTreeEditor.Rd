% Auto-generated: do not edit by hand
\name{dteDndTreeEditor}

\alias{dteDndTreeEditor}

\title{DndTreeEditor component}

\description{

}

\usage{
dteDndTreeEditor(id=NULL, collapsible=NULL, indentationWidth=NULL,
indicator=NULL, items=NULL, onItemsChange=NULL,
onRemove=NULL, onSelect=NULL, removable=NULL,
selectedId=NULL)
}

\arguments{
\item{id}{Character. }

\item{collapsible}{Logical | numeric | character | named list | unnamed list. }

\item{indentationWidth}{Numeric. }

\item{indicator}{Logical | numeric | character | named list | unnamed list. }

\item{items}{List of lists containing elements 'id', 'parent_id', 'label'.
those elements have the following types:
  - id (character; required)
  - parent_id (character; required)
  - label (character; optional)s. }

\item{onItemsChange}{}

\item{onRemove}{}

\item{onSelect}{}

\item{removable}{Logical | numeric | character | named list | unnamed list. }

\item{selectedId}{Character. }
}

\value{named list of JSON elements corresponding to React.js properties and their values}

