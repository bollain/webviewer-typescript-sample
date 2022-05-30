/// <reference path="../webviewer.d.ts" />
import WebViewer from '@pdftron/webviewer'
WebViewer({
  path: '/lib', // path to the PDFTron 'lib' folder on your server
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
}, document.getElementById('viewer'))
  .then(function (instance) {

    const { annotationManager, documentViewer } = instance.Core;

    class TriangleAnnotation extends instance.Core.Annotations.CustomAnnotation {
      constructor() {
        super('triangle'); // provide the custom XFDF element name
        this.Subject = 'Triangle';
      }

      draw(ctx: CanvasRenderingContext2D, pageMatrix: any): void {
        // the setStyles function is a function on markup annotations that sets up
        // certain properties for us on the canvas for the annotation's stroke thickness.
        this.setStyles(ctx, pageMatrix);

        // first we need to translate to the annotation's x/y coordinates so that it's
        // drawn in the correct location
        ctx.translate(this.X, this.Y);
        ctx.beginPath();
        ctx.moveTo(this.Width / 2, 0);
        ctx.lineTo(this.Width, this.Height);
        ctx.lineTo(0, this.Height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    TriangleAnnotation.prototype.elementName = 'triangle';

    annotationManager.registerAnnotationType(TriangleAnnotation.prototype.elementName, TriangleAnnotation);
    class TriangleCreateTool extends instance.Core.Tools.GenericAnnotationCreateTool {
      constructor(documentViewer: Core.DocumentViewer) {
        // TriangleAnnotation is the class (function) for our annotation we defined previously
        super(documentViewer, TriangleAnnotation as any);
      }
    };

    const triangleToolName = 'AnnotationCreateTriangle';
    const triangleTool = new TriangleCreateTool(documentViewer);
    instance.UI.registerTool({
      toolName: triangleToolName,
      toolObject: triangleTool,
      buttonImage: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>' +
        '<path fill="none" d="M0 0h24v24H0V0z"/>' +
        '</svg>',
      buttonName: 'triangleToolButton',
      tooltip: 'Triangle'
    }, undefined, (annotation) => {
      return annotation && annotation.Subject === 'Triangle'
    });

    instance.UI.setHeaderItems((header) => {
      header.getHeader('toolbarGroup-Shapes').get('freeHandToolGroupButton').insertBefore({
        type: 'toolButton',
        toolName: triangleToolName
      });
    });
    documentViewer.addEventListener('documentLoaded', () => {
      // set the tool mode to our tool so that we can start using it right away
      instance.UI.setToolMode(triangleToolName);
    });
  });



