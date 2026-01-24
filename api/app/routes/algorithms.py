"""Algorithm execution API routes."""

import json
from flask import Blueprint, Response, request, jsonify
from app.services.registry import registry

bp = Blueprint("algorithms", __name__, url_prefix="/api/algorithms")


@bp.route("", methods=["GET"])
def list_algorithms():
    """List all available algorithms.

    Returns:
        JSON list of algorithm metadata
    """
    algorithms = registry.list_algorithms()
    return jsonify(algorithms)


@bp.route("/<algorithm_id>", methods=["GET"])
def get_algorithm(algorithm_id: str):
    """Get metadata for a specific algorithm.

    Args:
        algorithm_id: ID of the algorithm

    Returns:
        JSON algorithm metadata
    """
    algo = registry.get_algorithm(algorithm_id)
    if not algo:
        return jsonify({"error": "Algorithm not found"}), 404

    return jsonify(
        {
            "id": algo["id"],
            "name": algo["name"],
            "category": algo["category"],
            "visualizer_type": algo["visualizer_type"],
        }
    )


@bp.route("/<algorithm_id>/execute", methods=["POST"])
def execute_algorithm(algorithm_id: str):
    """Execute an algorithm and return all steps.

    Request body:
        {
            "input": <input_data>
        }

    Returns:
        JSON array of visualization steps
    """
    try:
        data = request.get_json()
        if not data or "input" not in data:
            return jsonify({"error": "Missing 'input' in request body"}), 400

        input_data = data["input"]

        # Execute algorithm
        steps = registry.execute_algorithm(algorithm_id, input_data)

        return jsonify({"steps": steps, "count": len(steps)})

    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Execution failed: {str(e)}"}), 500


@bp.route("/<algorithm_id>/execute/stream", methods=["POST"])
def execute_algorithm_stream(algorithm_id: str):
    """Execute an algorithm and stream steps via Server-Sent Events.

    Request body:
        {
            "input": <input_data>
        }

    Returns:
        SSE stream of visualization steps
    """

    def generate():
        try:
            data = request.get_json()
            if not data or "input" not in data:
                yield f"data: {json.dumps({'error': 'Missing input'})}\n\n"
                return

            input_data = data["input"]

            # Get algorithm
            algo_info = registry.get_algorithm(algorithm_id)
            if not algo_info:
                yield f"data: {json.dumps({'error': 'Algorithm not found'})}\n\n"
                return

            # Execute and stream steps
            algo_class = algo_info["class"]
            instance = algo_class()

            # Execute based on algorithm type
            if algorithm_id == "bubble_sort":
                steps_generator = instance.sort(input_data)
            else:
                yield f"data: {json.dumps({'error': 'Unknown algorithm'})}\n\n"
                return

            # Stream each step
            for step in steps_generator:
                step_data = step.model_dump()
                yield f"data: {json.dumps(step_data)}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(generate(), mimetype="text/event-stream")


@bp.route("/<algorithm_id>/source", methods=["GET"])
def get_algorithm_source(algorithm_id: str):
    """Get the Python source code for an algorithm.

    Args:
        algorithm_id: ID of the algorithm

    Returns:
        JSON with source code
    """
    import inspect

    algo = registry.get_algorithm(algorithm_id)
    if not algo:
        return jsonify({"error": "Algorithm not found"}), 404

    try:
        source = inspect.getsource(algo["class"])
        return jsonify({"source": source})
    except Exception as e:
        return jsonify({"error": f"Failed to get source: {str(e)}"}), 500
